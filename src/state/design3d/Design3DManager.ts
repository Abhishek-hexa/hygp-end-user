import { makeAutoObservable } from 'mobx';

import { StateManager } from '../StateManager';
import { CameraManager } from './managers/CameraManager';
import { EnvManager } from './managers/EnvManager';
import { MeshManager } from './managers/MeshManager';
import { ModelRuntimeManager } from './managers/ModelRuntimeManager';
import { Product3DSyncManager } from './managers/Product3DSyncManager';
import { TextureRuntimeManager } from './managers/TextureRuntimeManager';

export class Design3DManager {
  private _libState: StateManager;
  private _meshManager: MeshManager;
  private _cameraManager: CameraManager;
  private _envManager: EnvManager;
  private _modelRuntimeManager: ModelRuntimeManager;
  private _textureRuntimeManager: TextureRuntimeManager;
  private _product3DSyncManager: Product3DSyncManager;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._meshManager = new MeshManager(libState);
    this._cameraManager = new CameraManager(libState);
    this._envManager = new EnvManager();
    this._modelRuntimeManager = new ModelRuntimeManager();
    this._textureRuntimeManager = new TextureRuntimeManager();
    this._product3DSyncManager = new Product3DSyncManager(
      libState,
      this._meshManager,
      this._modelRuntimeManager,
      this._textureRuntimeManager,
    );
    makeAutoObservable(this);
  }

  get meshManager() {
    return this._meshManager;
  }

  get cameraManager() {
    return this._cameraManager;
  }

  get envManager() {
    return this._envManager;
  }

  get modelRuntimeManager() {
    return this._modelRuntimeManager;
  }

  get textureRuntimeManager() {
    return this._textureRuntimeManager;
  }

  get product3DSyncManager() {
    return this._product3DSyncManager;
  }
}
