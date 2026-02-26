import { makeAutoObservable } from 'mobx';
import * as THREE from 'three';

import { MeshInfo } from '../../../core/MeshInfo';
import { StateManager } from '../../StateManager';

export class MeshManager {
  private _libState: StateManager;
  private _meshInfos: MeshInfo[] = [];
  private _groupRef: THREE.Group | null = null;
  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this);
  }

  get meshInfos() {
    return this._meshInfos;
  }

  setMeshInfos(meshInfos: MeshInfo[]) {
    this._meshInfos = meshInfos;
  }

  setGroupRef(group: THREE.Group | null) {
    this._groupRef = group;
  }

  get groupRef() {
    return this._groupRef;
  }
}
