import { makeAutoObservable } from 'mobx';

import { StateManager } from '../StateManager';
import { CameraManager } from './managers/CameraManager';
import { Engraving3Dmanager } from './managers/Engraving3Dmanager';
import { MeshManager } from './managers/MeshManager';

export class Design3DManager {
  private _libState: StateManager;
  private _cameraManager: CameraManager;
  private _meshManager: MeshManager;
  private _engraving3Dmanager: Engraving3Dmanager;
  private _canvasRef: HTMLCanvasElement | null = null;
  private _isLoading = false;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._meshManager = new MeshManager(libState);
    this._cameraManager = new CameraManager(libState);
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

  get isLoading() {
    return this._isLoading;
  }

  setCanvasRef(canvas: HTMLCanvasElement) {
    this._canvasRef = canvas;
  }

  takeScreenshot(): string | null {
    if (!this._canvasRef) {
      return null;
    }
    return (
      this._canvasRef.toDataURL('image/webp', 0.92) ||
      this._canvasRef.toDataURL('image/png')
    );
  }
}
