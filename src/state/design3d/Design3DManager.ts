import { makeAutoObservable } from 'mobx';

import { CameraManager } from './managers/CameraManager';
import { LightManager } from './managers/LightManager';
import { MeshManager } from './managers/MeshManager';
import { StateManager } from '../StateManager';

export class Design3DManager {
  private _libState: StateManager;
  private _cameraManager: CameraManager;
  private _lightManager = new LightManager();
  private _meshManager: MeshManager;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._meshManager = new MeshManager(libState);
    this._cameraManager = new CameraManager(libState);
    makeAutoObservable(this);
  }

  get cameraManager() {
    return this._cameraManager;
  }

  get lightManager() {
    return this._lightManager;
  }

  get meshManager() {
    return this._meshManager;
  }
}
