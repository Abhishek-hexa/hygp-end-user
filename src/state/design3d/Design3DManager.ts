import { makeAutoObservable } from 'mobx';

import { CameraManager } from './managers/CameraManager';
import { MeshManager } from './managers/MeshManager';
import { StateManager } from '../StateManager';
import { Engraving3Dmanager } from './managers/Engraving3Dmanager';
import { FontLoadManager } from './managers/FontLoadManager';

export class Design3DManager {
  private _libState: StateManager;
  private _cameraManager: CameraManager;
  private _meshManager: MeshManager;
  private _fontLoadManager: FontLoadManager;
  private _engraving3Dmanager: Engraving3Dmanager;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._meshManager = new MeshManager(libState);
    this._cameraManager = new CameraManager(libState);
    this._fontLoadManager = new FontLoadManager(libState);
    this._engraving3Dmanager = new Engraving3Dmanager(libState);
    makeAutoObservable(this);
  }

  get cameraManager() {
    return this._cameraManager;
  }

  get meshManager() {
    return this._meshManager;
  }

  get engraving3Dmanager() {
    return this._engraving3Dmanager;
  }

  get fontLoadManager() {
    return this._fontLoadManager;
  }
}
