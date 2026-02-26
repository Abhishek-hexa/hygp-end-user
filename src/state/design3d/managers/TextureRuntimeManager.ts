import { makeAutoObservable } from 'mobx';
import * as THREE from 'three';

import { Utils3D } from '../../../utils/Utils3D';

export class TextureRuntimeManager {
  private _isLoading = false;
  private _error: string | null = null;
  private _cache = new Map<string, THREE.Texture>();

  constructor() {
    makeAutoObservable(this);
  }

  get isLoading() {
    return this._isLoading;
  }

  get error() {
    return this._error;
  }

  async loadTexture(textureUrl: string | null): Promise<THREE.Texture | null> {
    if (!textureUrl) {
      this._error = null;
      this._isLoading = false;
      return null;
    }

    const cachedTexture = this._cache.get(textureUrl);
    if (cachedTexture) {
      return cachedTexture;
    }

    this._isLoading = true;
    this._error = null;

    try {
      const texture = await Utils3D.loadTexture(textureUrl);
      this._cache.set(textureUrl, texture);
      return texture;
    } catch (error) {
      this._error = String(error);
      return null;
    } finally {
      this._isLoading = false;
    }
  }

  disposeAllExcept(retainUrls: string[]) {
    const retain = new Set(retainUrls);

    Array.from(this._cache.entries()).forEach(([url, texture]) => {
      if (!retain.has(url)) {
        texture.dispose();
        this._cache.delete(url);
      }
    });
  }
}
