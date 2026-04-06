import * as THREE from 'three';
import { makeAutoObservable } from 'mobx';
import { StateManager } from '../../StateManager';
import { ProductType } from '../../product/types';
import { MeshName, visibleMeshNamesByProductType } from './meshNames';

type ModelVariant = 'DEFAULT' | 'PLASTIC';

type MeshBuckets = {
  buckleMeshes: Map<MeshName, THREE.Mesh>;
  webMeshes: Map<MeshName, THREE.Mesh>;
  stitchMeshes: Map<MeshName, THREE.Mesh>;
};

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
]);

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
  'Base',
]);

const STITCH_MESH_NAMES = new Set<MeshName>(['Stiches', 'Stitches']);

function getBucketName(meshName: MeshName): keyof MeshBuckets | null {
  if (BUCKLE_MESH_NAMES.has(meshName)) {
    return 'buckleMeshes';
  }
  if (WEB_MESH_NAMES.has(meshName)) {
    return 'webMeshes';
  }
  if (STITCH_MESH_NAMES.has(meshName)) {
    return 'stitchMeshes';
  }
  return null;
}

function createEmptyBuckets(): MeshBuckets {
  return {
    buckleMeshes: new Map(),
    webMeshes: new Map(),
    stitchMeshes: new Map(),
  };
}

export class MeshManager {
  private _libState: StateManager;
  private _variantGroups: Record<
    ModelVariant,
    { key: string | null; group: THREE.Group | null }
  > = {
    DEFAULT: { key: null, group: null },
    PLASTIC: { key: null, group: null },
  };
  private _meshBuckets: Record<ModelVariant, MeshBuckets> = {
    DEFAULT: createEmptyBuckets(),
    PLASTIC: createEmptyBuckets(),
  };

  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get productType(): ProductType {
    return this._libState.designManager.productManager.productId;
  }

  private get shouldUsePlasticModel() {
    return (
      this.productType === ProductType.DOG_COLLAR &&
      this._libState.designManager.productManager.buckleManager.material ===
        'PLASTIC'
    );
  }

  private get activeVariant(): ModelVariant {
    return this.shouldUsePlasticModel ? 'PLASTIC' : 'DEFAULT';
  }

  get buckleMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].buckleMeshes;
  }

  get webMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].webMeshes;
  }

  get stitchMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].stitchMeshes;
  }

  // --- Web Mesh Getters ---
  get webMesh() {
    return this.webMeshes.get('Web');
  }
  get webTextMesh() {
    return this.webMeshes.get('Web_Text');
  }
  get leashMesh() {
    return this.webMeshes.get('Leash');
  }
  get base1Mesh() {
    return this.webMeshes.get('base1');
  }
  get base1PartMesh() {
    return this.webMeshes.get('base1Part');
  }
  get beltsMesh() {
    return this.webMeshes.get('belts');
  }
  get bottomMesh() {
    return this.webMeshes.get('bottom');
  }
  get base2Mesh() {
    return this.webMeshes.get('base2');
  }
  get martingleMesh() {
    return this.webMeshes.get('Martingle');
  }
  get baseMesh() {
    return this.webMeshes.get('Base');
  }

  // --- Buckle Mesh Getters ---
  get buckleMesh() {
    return this.buckleMeshes.get('Buckle');
  }
  get dRingMesh() {
    return this.buckleMeshes.get('D_Ring');
  }
  get triGlideMesh() {
    return this.buckleMeshes.get('Tri_Glide');
  }
  get planeMesh() {
    return this.buckleMeshes.get('Plane');
  }
  get catBuckleMesh() {
    return this.buckleMeshes.get('Cat_Buckle');
  }
  get glassMesh() {
    return this.buckleMeshes.get('Glass');
  }
  get glassSmallMesh() {
    return this.buckleMeshes.get('glass');
  }
  get hookMesh() {
    return this.buckleMeshes.get('Hook');
  }
  get dLinkMesh() {
    return this.buckleMeshes.get('dLink');
  }
  get aLinkMesh() {
    return this.buckleMeshes.get('aLink');
  }
  get buckle1Mesh() {
    return this.buckleMeshes.get('buckle1');
  }
  get buckle2Mesh() {
    return this.buckleMeshes.get('buckle2');
  }
  get triGlide1Mesh() {
    return this.buckleMeshes.get('triGlide1');
  }
  get triGlide2Mesh() {
    return this.buckleMeshes.get('triGlide2');
  }
  get triGlide1UpperMesh() {
    return this.buckleMeshes.get('Tri_Glide1');
  }
  get triGlide2UpperMesh() {
    return this.buckleMeshes.get('Tri_Glide2');
  }

  // --- Stitch Mesh Getters ---
  get stichesMesh() {
    return this.stitchMeshes.get('Stiches');
  }
  get stitchesMesh() {
    return this.stitchMeshes.get('Stitches');
  }

  get fitModelMesh(): THREE.Object3D | undefined {
    switch (this.productType) {
      case ProductType.DOG_COLLAR:
      case ProductType.CAT_COLLAR:
        return this.webMesh;
      case ProductType.MARTINGALE:
        return this.martingleMesh ?? this.webMesh;
      case ProductType.LEASH:
        return this.leashMesh;
      case ProductType.BANDANA:
        return this.baseMesh;
      case ProductType.HARNESS:
        return (
          this.base1Mesh ??
          this.base1PartMesh ??
          this.base2Mesh ??
          this.beltsMesh ??
          this.bottomMesh
        );
      default:
        return this.webMesh;
    }
  }

  getMeshGroup(key: string): THREE.Group | undefined {
    return this.getGroupByKey(key) ?? undefined;
  }

  getVisibleMeshCenter(key: string): THREE.Vector3 | null {
    const group = this.getGroupByKey(key);
    if (!group) {
      return null;
    }

    return this.computeVisibleCenter(group);
  }

  setMeshGroup(
    key: string,
    group: THREE.Group,
    variant: ModelVariant = 'DEFAULT',
  ) {
    this._variantGroups[variant] = { key, group };
    this.parseMeshGroup(group, variant);
  }

  private getGroupByKey(key: string): THREE.Group | null {
    const defaultGroup = this._variantGroups.DEFAULT;
    if (defaultGroup.key === key && defaultGroup.group) {
      return defaultGroup.group;
    }

    const plasticGroup = this._variantGroups.PLASTIC;
    if (plasticGroup.key === key && plasticGroup.group) {
      return plasticGroup.group;
    }

    return null;
  }

  private computeVisibleCenter(group: THREE.Group): THREE.Vector3 | null {
    const visibleNames = new Set<MeshName>(
      visibleMeshNamesByProductType[this.productType] as readonly MeshName[],
    );
    const shouldFilterByNames = visibleNames.size > 0;
    const visibleBounds = new THREE.Box3().makeEmpty();
    const meshBounds = new THREE.Box3();

    group.updateMatrixWorld(true);

    group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const meshName = child.name as MeshName;
      child.visible = !shouldFilterByNames || visibleNames.has(meshName);
      if (!child.visible) return;

      const geometry = child.geometry;
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }
      if (!geometry.boundingBox) return;

      meshBounds.copy(geometry.boundingBox).applyMatrix4(child.matrixWorld);
      visibleBounds.union(meshBounds);
    });

    if (visibleBounds.isEmpty()) {
      return null;
    }

    const center = new THREE.Vector3();
    visibleBounds.getCenter(center);
    return center;
  }

  private parseMeshGroup(group: THREE.Group, variant: ModelVariant) {
    const visibleNames = new Set<MeshName>(
      visibleMeshNamesByProductType[this.productType] as readonly MeshName[],
    );
    const shouldFilterByNames = visibleNames.size > 0;
    const bucket = createEmptyBuckets();
    const visibleBounds = new THREE.Box3().makeEmpty();
    const meshBounds = new THREE.Box3();

    group.updateMatrixWorld(true);

    group.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const meshName = child.name as MeshName;
      const bucketName = getBucketName(meshName);
      if (bucketName) {
        bucket[bucketName].set(meshName, child);
      }

      child.visible = !shouldFilterByNames || visibleNames.has(meshName);

      if (!child.visible) return;

      const geometry = child.geometry;
      if (!geometry.boundingBox) {
        geometry.computeBoundingBox();
      }
      if (!geometry.boundingBox) return;

      meshBounds.copy(geometry.boundingBox).applyMatrix4(child.matrixWorld);
      visibleBounds.union(meshBounds);
    });

    this._meshBuckets[variant] = bucket;
    if (visibleBounds.isEmpty()) {
      return;
    }

    // Bounding box center for rotation axes.
    const center = new THREE.Vector3();
    visibleBounds.getCenter(center);

    // Use model size to keep clipping stable across product scales.
    const boundsSize = new THREE.Vector3();
    visibleBounds.getSize(boundsSize);
    const modelRadius = boundsSize.length() * 0.5;
    const dynamicNear = THREE.MathUtils.clamp(modelRadius * 0.1, 0.1, 100);
    const dynamicFar = THREE.MathUtils.clamp(modelRadius * 30, 500, 10000);
    const dynamicMinDistance = THREE.MathUtils.clamp(
      modelRadius * 1.5,
      50,
      2000,
    );
    const dynamicMaxDistance = THREE.MathUtils.clamp(
      modelRadius * 8,
      300,
      6000,
    );

    // In dual-variant products (plastic/metal), only the active variant should
    // set camera values; otherwise the second parsed variant can overwrite them.
    if (variant === this.activeVariant) {
      this._libState.design3DManager.cameraManager.setTarget(center);
      this._libState.design3DManager.cameraManager.setNear(dynamicNear);
      this._libState.design3DManager.cameraManager.setFar(
        Math.max(dynamicFar, dynamicNear + 1),
      );
      this._libState.design3DManager.cameraManager.setMinDistance(
        Math.min(dynamicMinDistance, dynamicMaxDistance - 1),
      );
      this._libState.design3DManager.cameraManager.setMaxDistance(
        Math.max(dynamicMaxDistance, dynamicMinDistance + 1),
      );
    }
  }
}
