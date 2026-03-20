import * as THREE from 'three';
import { makeAutoObservable } from 'mobx';
import { StateManager } from '../../StateManager';
import { ProductType } from '../../product/types';
import { MeshName, visibleMeshNamesByProductType } from './meshNames';

export class MeshManager {
  private _libState: StateManager;
  private _meshGroups: Record<string, THREE.Group> = {};
  private _buckleMeshes: THREE.Mesh[] = [];
  private _webMeshes: THREE.Mesh[] = [];
  private _stitchMeshes: THREE.Mesh[] = [];

  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get productType(): ProductType {
    return this._libState.designManager.productManager.productId;
  }

  get buckleMeshes(): THREE.Mesh[] {
    return this._buckleMeshes;
  }

  get webMeshes(): THREE.Mesh[] {
    return this._webMeshes;
  }

  get stitchMeshes(): THREE.Mesh[] {
    return this._stitchMeshes;
  }

  getMeshGroup(key: string): THREE.Group | undefined {
    return this._meshGroups[key];
  }

  setMeshGroup(key: string, group: THREE.Group) {
    if (this._meshGroups[key] === group) {
      return;
    }

    this._meshGroups[key] = group;
    this._buckleMeshes = [];
    this._webMeshes = [];
    this._stitchMeshes = [];
    this.parseMeshGroup(group);
  }

  private parseMeshGroup(group: THREE.Group) {
    const visibleNames = new Set(
      visibleMeshNamesByProductType[this.productType] ?? [],
    );
    const shouldFilterByNames = visibleNames.size > 0;

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (
          (child.name as MeshName) === 'Buckle' ||
          (child.name as MeshName) === 'D_Ring' ||
          (child.name as MeshName) === 'Tri_Glide' ||
          (child.name as MeshName) === 'Plane'
        ) {
          this._buckleMeshes.push(child);
        }

        if (
          (child.name as MeshName) === 'Web' ||
          (child.name as MeshName) === 'Web_Text'
        ) {
          this._webMeshes.push(child);
        }

        if ((child.name as MeshName) === 'Stiches') {
          this._stitchMeshes.push(child);
        }

        child.visible =
          !shouldFilterByNames || visibleNames.has(child.name as MeshName);
      }
    });
  }
}
