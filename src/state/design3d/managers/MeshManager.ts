import * as THREE from 'three';
import { makeAutoObservable } from 'mobx';
import { StateManager } from '../../StateManager';
import { ProductType } from '../../product/types';
import { MeshName, visibleMeshNamesByProductType } from './meshNames';

export class MeshManager {
  private _libState: StateManager;
  private _meshGroups: Record<string, THREE.Group> = {};

  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get productType(): ProductType {
    return this._libState.designManager.productManager.productId;
  }

  getMeshGroup(key: string): THREE.Group | undefined {
    return this._meshGroups[key];
  }

  setMeshGroup(key: string, group: THREE.Group) {
    this._meshGroups[key] = group;
    this.parseMeshGroup(group);
  }

  private parseMeshGroup(group: THREE.Group) {
    const visibleNames = new Set(
      visibleMeshNamesByProductType[this.productType] ?? [],
    );
    const shouldFilterByNames = visibleNames.size > 0;

    group.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.visible =
          !shouldFilterByNames ||
          visibleNames.has(child.name as MeshName);
      }
    });
  }
}
