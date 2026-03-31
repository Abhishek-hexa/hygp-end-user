import * as THREE from 'three'
import { makeAutoObservable } from 'mobx'
import { StateManager } from '../../StateManager'
import { ProductType } from '../../product/types'
import { MeshName, visibleMeshNamesByProductType } from './meshNames'

type ModelVariant = 'DEFAULT' | 'PLASTIC'

type MeshBuckets = {
  buckleMeshes: Map<MeshName, THREE.Mesh>
  webMeshes: Map<MeshName, THREE.Mesh>
  stitchMeshes: Map<MeshName, THREE.Mesh>
}

const BUCKLE_MESH_NAMES = new Set<MeshName>([
  'Buckle',
  'D_Ring',
  'Tri_Glide',
  'Plane',
  'Cat_Buckle',
  'Glass',
  'glass',
  'Hook',
  'dLink',
  'aLink',
  'buckle1',
  'buckle2',
  'triGlide1',
  'triGlide2',
  'Tri_Glide1',
  'Tri_Glide2',
])

const WEB_MESH_NAMES = new Set<MeshName>([
  'Web',
  'Web_Text',
  'Leash',
  'base1',
  'base1Part',
  'belts',
  'bottom',
  'base2',
  'Martingle',
  'Base'
])

const STITCH_MESH_NAMES = new Set<MeshName>(['Stiches','Stitches'])

function getBucketName(meshName: MeshName): keyof MeshBuckets | null {
  if (BUCKLE_MESH_NAMES.has(meshName)) {
    return 'buckleMeshes'
  }
  if (WEB_MESH_NAMES.has(meshName)) {
    return 'webMeshes'
  }
  if (STITCH_MESH_NAMES.has(meshName)) {
    return 'stitchMeshes'
  }
  return null
}

function createEmptyBuckets(): MeshBuckets {
  return {
    buckleMeshes: new Map(),
    webMeshes: new Map(),
    stitchMeshes: new Map(),
  }
}

export class MeshManager {
  private _libState: StateManager
  private _meshGroups: Record<string, THREE.Group> = {}
  private _visibleMeshCenters: Record<string, [number, number, number] | null> = {}
  private _meshBuckets: Record<ModelVariant, MeshBuckets> = {
    DEFAULT: createEmptyBuckets(),
    PLASTIC: createEmptyBuckets(),
  }

  constructor(libState: StateManager) {
    this._libState = libState
    makeAutoObservable(this, {}, { autoBind: true })
  }

  get productType(): ProductType {
    return this._libState.designManager.productManager.productId
  }

  private get shouldUsePlasticModel() {
    return (
      this.productType === 'DOG_COLLAR' &&
      this._libState.designManager.productManager.buckleManager.material === 'PLASTIC'
    )
  }

  private get activeVariant(): ModelVariant {
    return this.shouldUsePlasticModel ? 'PLASTIC' : 'DEFAULT'
  }

  get buckleMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].buckleMeshes
  }

  get webMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].webMeshes
  }

  get stitchMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].stitchMeshes
  }

  getMeshGroup(key: string): THREE.Group | undefined {
    return this._meshGroups[key]
  }

  getVisibleMeshCenter(key: string): [number, number, number] | null {
    return this._visibleMeshCenters[key] ?? null
  }

  setMeshGroup(key: string, group: THREE.Group, variant: ModelVariant = 'DEFAULT') {
    this._meshGroups[key] = group
    this.parseMeshGroup(key, group, variant)
  }

  private parseMeshGroup(key: string, group: THREE.Group, variant: ModelVariant) {
    const visibleNames = new Set<MeshName>(
      visibleMeshNamesByProductType[this.productType] as readonly MeshName[],
    )
    const shouldFilterByNames = visibleNames.size > 0
    const bucket = createEmptyBuckets()
    const visibleBounds = new THREE.Box3().makeEmpty()
    const meshBounds = new THREE.Box3()

    group.updateMatrixWorld(true)

    group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      const meshName = child.name as MeshName
      const bucketName = getBucketName(meshName)
      if (bucketName) {
        bucket[bucketName].set(meshName, child)
      }

      child.visible = !shouldFilterByNames || visibleNames.has(meshName)

      if (!child.visible) return

      const geometry = child.geometry
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox()
      }
      if (!geometry.boundingBox) return

      meshBounds.copy(geometry.boundingBox).applyMatrix4(child.matrixWorld)
      visibleBounds.union(meshBounds)
    })

    this._meshBuckets[variant] = bucket
    if (visibleBounds.isEmpty()) {
      this._visibleMeshCenters[key] = null
      return
    }

    // Bounding box center for rotation axes.
    const center = new THREE.Vector3()
    visibleBounds.getCenter(center)
    this._visibleMeshCenters[key] = [center.x, center.y, center.z]

    // Use model size to keep clipping stable across product scales.
    const boundsSize = new THREE.Vector3()
    visibleBounds.getSize(boundsSize)
    const modelRadius = boundsSize.length() * 0.5
    const dynamicNear = THREE.MathUtils.clamp(modelRadius * 0.1, 0.1, 100)

    // In dual-variant products(plasti/ metal), only the active variant should set near,
    // otherwise the second parsed variant can overwrite it.
    if (variant === this.activeVariant) {
      this._libState.design3DManager.cameraManager.setNear(dynamicNear)
    }
  }
}
