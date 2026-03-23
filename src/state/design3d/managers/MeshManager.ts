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

export class MeshManager {
  private _libState: StateManager;
  private _meshGroups: Record<string, THREE.Group> = {};
  private _meshBuckets: Record<ModelVariant, MeshBuckets> = {
    DEFAULT: {
      buckleMeshes: new Map(),
      webMeshes: new Map(),
      stitchMeshes: new Map(),
    },
    PLASTIC: {
      buckleMeshes: new Map(),
      webMeshes: new Map(),
      stitchMeshes: new Map(),
    },
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
      this.productType === 'DOG_COLLAR' &&
      this._libState.designManager.productManager.buckleManager.material ===
        'PLASTIC'
    );
  }

  private get activeVariant(): ModelVariant {
    return this.shouldUsePlasticModel ? 'PLASTIC' : 'DEFAULT';
  }

  get defaultBuckleMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.DEFAULT.buckleMeshes;
  }

  get plasticBuckleMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.PLASTIC.buckleMeshes;
  }

  get buckleMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].buckleMeshes;
  }

  get defaultWebMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.DEFAULT.webMeshes;
  }

  get plasticWebMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.PLASTIC.webMeshes;
  }

  get webMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].webMeshes;
  }

  get defaultStitchMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.DEFAULT.stitchMeshes;
  }

  get plasticStitchMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets.PLASTIC.stitchMeshes;
  }

  get stitchMeshes(): Map<MeshName, THREE.Mesh> {
    return this._meshBuckets[this.activeVariant].stitchMeshes;
  }

  getMeshGroup(key: string): THREE.Group | undefined {
    return this._meshGroups[key];
  }

  setMeshGroup(key: string, group: THREE.Group, variant: ModelVariant = 'DEFAULT') {
    this._meshGroups[key] = group;
    this.parseMeshGroup(group, variant);
  }

  private parseMeshGroup(group: THREE.Group, variant: ModelVariant) {
    const visibleNames = new Set<MeshName>(
      visibleMeshNamesByProductType[this.productType] as readonly MeshName[],
    );
    const shouldFilterByNames = visibleNames.size > 0;
    const bucket = this._meshBuckets[variant];

    bucket.buckleMeshes = new Map();
    bucket.webMeshes = new Map();
    bucket.stitchMeshes = new Map();

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        console.log(child.name)
        if (
          (child.name as MeshName) === 'Buckle' ||
          (child.name as MeshName) === 'D_Ring' ||
          (child.name as MeshName) === 'Tri_Glide' ||
          (child.name as MeshName) === 'Plane' ||
          (child.name as MeshName) === 'Cat_Buckle' ||
          (child.name as MeshName) === 'Glass'  ||
          (child.name as MeshName) === 'glass'  ||
          (child.name as MeshName) === 'Hook' ||
          (child.name as MeshName) === 'dLink' ||
          (child.name as MeshName) === 'aLink' ||
          (child.name as MeshName) === 'buckle1' ||
          (child.name as MeshName) === 'buckle2' ||
          (child.name as MeshName) === 'triGlide1' ||
          (child.name as MeshName) === 'triGlide2' 
        ) {
          bucket.buckleMeshes.set(child.name as MeshName, child);
        }

        if (
          (child.name as MeshName) === 'Web' ||
          (child.name as MeshName) === 'Web_Text' ||
          (child.name as MeshName) === 'Leash' ||
          (child.name as MeshName) === 'base1' ||
          (child.name as MeshName) === 'base1Part' ||
          (child.name as MeshName) === 'belts' ||
          (child.name as MeshName) === 'bottom' ||
          (child.name as MeshName) === 'base2'
        ) {
          bucket.webMeshes.set(child.name as MeshName, child);
        }

        if ((child.name as MeshName) === 'Stiches') {
          bucket.stitchMeshes.set(child.name as MeshName, child);
        }

        child.visible =
          !shouldFilterByNames || visibleNames.has(child.name as MeshName);
      }
    });
  }
}
