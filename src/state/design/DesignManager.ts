import { makeAutoObservable } from 'mobx';

import { ProductManager } from '../product/ProductManager';
import { StateManager } from '../StateManager';

export class DesignManager {
  private _libState: StateManager;
  private _productManager: ProductManager;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._productManager = new ProductManager();
    makeAutoObservable(this);
  }

  get productManager() {
    return this._productManager;
  }
}
