import { makeAutoObservable } from 'mobx';

import { ProductManager } from '../product/ProductManager';
import { Features } from '../product/types';
import { StateManager } from '../StateManager';

export class DesignManager {
  private _libState: StateManager;
  private _productManager: ProductManager;
  private _activeFeature: Features | null = null;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._productManager = new ProductManager();
    makeAutoObservable(this);
    this._activeFeature = this.availableFeatures[0] ?? null;
  }

  get productManager() {
    return this._productManager;
  }

  get availableFeatures() {
    return this._productManager.getAllFeatures();
  }

  get activeFeature() {
    return this._activeFeature;
  }

  setActiveFeature(feature: Features | null) {
    this._activeFeature = feature;
  }
}
