import { makeAutoObservable } from 'mobx';

import { ProductManager } from '../product/ProductManager';
import { ProductStore } from '../product/ProductStore';
import { StateManager } from '../StateManager';

export class DesignManager {
  private _libState: StateManager;
  private _productManager: ProductManager;
  private _productStore: ProductStore;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._productManager = new ProductManager();
    this._productStore = new ProductStore();
    makeAutoObservable(this);
  }

  get productManager() {
    return this._productManager;
  }

  get productStore() {
    return this._productStore;
  }

  get availableFeatures() {
    return this._productManager.getAllFeatures();
  }
}
