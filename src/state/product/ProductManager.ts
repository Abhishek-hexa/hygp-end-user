import { makeAutoObservable } from 'mobx';

import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { TextureManager } from './managers/MaterialManager';
import { SizeManager } from './managers/SizeManager';
import { TextManager } from './managers/TextManager';
import { defaultProductId, productConfigs } from './productConfig';
import { ProductId } from './types';

export class ProductManager {
  private _productId: ProductId = defaultProductId;
  private _size = new SizeManager();
  private _buckle = new BuckleManager();
  private _engraving = new EngravingManager();
  private _text = new TextManager();
  private _material = new TextureManager();

  constructor() {
    makeAutoObservable(this);
  }

  get productId() {
    return this._productId;
  }

  get size() {
    return this._size;
  }

  get buckle() {
    return this._buckle;
  }

  get engraving() {
    return this._engraving;
  }

  get text() {
    return this._text;
  }

  get material() {
    return this._material;
  }

  get config() {
    return productConfigs[this._productId];
  }

  get capabilities() {
    return this.config.capabilities;
  }

  getModelPath() {
    if (!this._size.selectedSize) {
      return null;
    }
    return this.config.model(this._size.selectedSize);
  }

  get resolvedModelPath() {
    return this.getModelPath();
  }

  canUseEngraving() {
    if (!this.capabilities.hasEngraving) {
      return false;
    }

    const engravingConfig = this.config.features.engraving;
    if (!engravingConfig.enabled) {
      return false;
    }
    if (engravingConfig.requiresBuckle) {
      return this._buckle.type === engravingConfig.requiresBuckle;
    }
    return true;
  }

  canUseText() {
    return this.config.features.text.enabled;
  }

  canMoveText() {
    return this.config.features.text.positionable ?? false;
  }

  canResizeText() {
    if (!this.canUseText()) {
      return false;
    }

    if (!this.capabilities.hasFabricTextResizeUI) {
      return false;
    }

    return this.config.features.text.scalable ?? false;
  }

  hasBuckle() {
    return this.capabilities.hasBuckle;
  }

  hasHardware() {
    return this.capabilities.hasHardware;
  }

  hasMatchingLeash() {
    return this.capabilities.hasMatchingLeash;
  }

  hasDualCheckout() {
    return this.capabilities.hasDualCheckout;
  }

  setProduct(productId: ProductId) {
    this._productId = productId;
    this.resetAll();
  }

  getAllFeatures() {
    return this.config.availableFeatures;
  }

  resetAll() {
    this._size.reset();
    this._buckle.reset();
    this._engraving.reset();
    this._text.reset();
    this._material.reset();
  }
}
