import { makeAutoObservable } from 'mobx';

import { CameraManager } from './managers/CameraManager';
import { LightManager } from './managers/LightManager';
import { StateManager } from '../StateManager';

export class Design3DManager {
  private _libState: StateManager;
  private _cameraManager = new CameraManager();
  private _lightManager = new LightManager();

  constructor(libState: StateManager) {
    this._libState = libState;
    makeAutoObservable(this);
  }

  get cameraManager() {
    return this._cameraManager;
  }

  get lightManager() {
    return this._lightManager;
  }
}
