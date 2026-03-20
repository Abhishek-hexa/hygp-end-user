import { makeAutoObservable } from 'mobx';

export type Vec3 = [number, number, number];

export class CameraManager {
  private _position: Vec3 = [0, 0.25, 2.6];
  private _target: Vec3 = [0, 0, 0];
  private _fov = 26;
  private _near = 0.1;
  private _far = 10000;
  private _isAutoRotate = false;
  private _autoRotateSpeed = 0.5;

  constructor() {
    makeAutoObservable(this);
  }

  get position() {
    return this._position;
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

  get isAutoRotate() {
    return this._isAutoRotate;
  }

  get autoRotateSpeed() {
    return this._autoRotateSpeed;
  }

  setPosition(position: Vec3) {
    this._position = position;
  }

  setTarget(target: Vec3) {
    this._target = target;
  }

  setFov(fov: number) {
    this._fov = fov;
  }

  setNear(near: number) {
    this._near = near;
  }

  setFar(far: number) {
    this._far = far;
  }

  setAutoRotate(isAutoRotate: boolean) {
    this._isAutoRotate = isAutoRotate;
  }

  setAutoRotateSpeed(speed: number) {
    this._autoRotateSpeed = speed;
  }
}
