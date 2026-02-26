import { makeAutoObservable } from 'mobx';

import { MeshInfo } from '../../../core/MeshInfo';
import { Utils3D } from '../../../utils/Utils3D';

export class ModelRuntimeManager {
  private _isLoading = false;
  private _error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async loadMeshInfos(modelUrl: string | null): Promise<MeshInfo[]> {
    if (!modelUrl) {
      this._error = null;
      this._isLoading = false;
      return [];
    }

    this._isLoading = true;
    this._error = null;

    try {
      const nodes = await Utils3D.loadNodeMapForGLTF(modelUrl);
      return Object.values(nodes).map((mesh) => MeshInfo.parseMeshInfo(mesh));
    } catch (error) {
      this._error = String(error);
      return [];
    } finally {
      this._isLoading = false;
    }
  }
}
