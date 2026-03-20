import { makeAutoObservable } from 'mobx';

import { Vec3 } from './CameraManager';

export class LightManager {
  private _ambientIntensity = 0.7;
  private _directionalIntensity = 1.1;
  private _directionalPosition: Vec3 = [3, 5, 2];
  private _hemisphereIntensity = 0.35;
  private _castShadow = true;

  constructor() {
    makeAutoObservable(this);
  }

  get ambientIntensity() {
    return this._ambientIntensity;
  }

  get directionalIntensity() {
    return this._directionalIntensity;
  }

  get directionalPosition() {
    return this._directionalPosition;
  }

  get hemisphereIntensity() {
    return this._hemisphereIntensity;
  }

  get castShadow() {
    return this._castShadow;
  }

  setAmbientIntensity(intensity: number) {
    this._ambientIntensity = intensity;
  }

  setDirectionalIntensity(intensity: number) {
    this._directionalIntensity = intensity;
  }

  setDirectionalPosition(position: Vec3) {
    this._directionalPosition = position;
  }

  setHemisphereIntensity(intensity: number) {
    this._hemisphereIntensity = intensity;
  }

  setCastShadow(castShadow: boolean) {
    this._castShadow = castShadow;
  }
}
