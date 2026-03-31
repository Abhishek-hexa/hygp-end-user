import { makeAutoObservable } from 'mobx';
import { StateManager } from '../../StateManager';

export type Vec3 = [number, number, number];

export class CameraManager {
  private _target: Vec3 = [0, 0, 0];
  private _fov = 26;
  private _near = 100;
  private _far = 2000;
  private _minDistance = 200;
  private _maxDistance = 800;
  private _isAutoRotate = false;
  private _autoRotateSpeed = 0.5;

  constructor(_: StateManager) {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get target() {
    return this._target;
  }

  get fov() {
    return this._fov;
  }

  get near() {
    return this._near;
  }

  get far() {
    return this._far;
  }

  get minDistance() {
    return this._minDistance;
  }

  get maxDistance() {
    return this._maxDistance;
  }

  get isAutoRotate() {
    return this._isAutoRotate;
  }

  get autoRotateSpeed() {
    return this._autoRotateSpeed;
  }

  setTarget(inTarget: Vec3) {
    this._target = inTarget;
  }

  setNear(inNear: number) {
    this._near = inNear
  }

  setFar(inFar: number) {
    this._far = inFar
  }

  setMinDistance(inMinDistance: number) {
    this._minDistance = inMinDistance
  }

  setMaxDistance(inMaxDistance: number) {
    this._maxDistance = inMaxDistance
  }
}
