import { makeAutoObservable } from 'mobx';

import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { SizeManager } from './managers/SizeManager';
import { TextureManager } from './managers/TextureManager';
import { WebbingTextManager } from './managers/WebbingTextManager';
import { defaultProductId, productConfigs } from './productConfig';
import { ProductType } from './types';

export class ProductManager {
  private _productId: ProductType = defaultProductId;
  private _sizeManager = new SizeManager();
  private _buckleManager = new BuckleManager();
  private _engravingManager = new EngravingManager();
  private _webbingTextManager = new WebbingTextManager();
  private _textureManager = new TextureManager();

  constructor() {
    makeAutoObservable(this);
  }

  get productId() {
    return this._productId;
  }

  get sizeManager() {
    return this._sizeManager;
  }

  get buckleManager() {
    return this._buckleManager;
  }

  get engravingManager() {
    return this._engravingManager;
  }

  get webbingText() {
    return this._webbingTextManager;
  }

  get textureManager() {
    return this._textureManager;
  }

  get productConfig() {
    return productConfigs[this._productId];
  }

  getModelPath() {
    const selectedSize = this._sizeManager.selectedSize;
    if (!selectedSize) {
      return null;
    }

    return this._sizeManager.availableSizes.get(selectedSize)?.model ?? null;
  }

  setProduct(inProductId: ProductType) {
    this._productId = inProductId;
    this.resetAll();
  }

  getAllFeatures() {
    return this.productConfig.features;
  }

  resetAll() {
    this._sizeManager.reset();
    this._buckleManager.reset();
    this._engravingManager.reset();
    this._webbingTextManager.reset();
    this._textureManager.reset();
  }
}
