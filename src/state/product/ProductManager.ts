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
    if (!this._sizeManager.selectedSize) {
      return null;
    }
    return this.productConfig.model(this._sizeManager.selectedSize);
  }

  canUseEngraving() {
    return this.productConfig.features.includes('ENGRAVING');
  }

  canUseText() {
    return (
      this.productConfig.features.includes('COLLAR_TEXT') ||
      this.productConfig.features.includes('HARNESS_TEXT')
    );
  }

  canMoveText() {
    return false;
  }

  canResizeText() {
    if (!this.canUseText()) {
      return false;
    }

    return false;
  }

  hasBuckle() {
    return this.productConfig.features.includes('BUCKLE');
  }

  hasHardware() {
    return this.productConfig.features.includes('HARDWARE');
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
