import { makeAutoObservable } from 'mobx';

export class TextureManager {
  private _texture: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get material() {
    return this._texture;
  }

  setMaterial(material: string) {
    this._texture = material;
  }

  reset() {
    this._texture = null;
  }
}
