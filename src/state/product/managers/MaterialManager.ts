import { makeAutoObservable } from 'mobx';

export class MaterialManager {
  private _material: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get material() {
    return this._material;
  }

  setMaterial(material: string) {
    this._material = material;
  }

  reset() {
    this._material = null;
  }
}
