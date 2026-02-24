import { makeAutoObservable } from 'mobx';

import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { MaterialManager } from './managers/MaterialManager';
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
  private _material = new MaterialManager();

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
    const engravingConfig = this.config.features.engraving;
    if (!engravingConfig.enabled) {
      return false;
    }
    if (engravingConfig.requiresBuckle) {
      return this._buckle.type === engravingConfig.requiresBuckle;
    }
    return true;
  }

  getValidEngravingLines() {
    if (!this.canUseEngraving()) {
      return [];
    }
    const max = this.config.features.engraving.maxLines ?? 0;
    return this._engraving.lines.slice(0, max);
  }

  canUseText() {
    return this.config.features.text.enabled;
  }

  canMoveText() {
    return this.config.features.text.positionable ?? false;
  }

  setProduct(productId: ProductId) {
    this._productId = productId;
    this.resetAll();
  }

  resetAll() {
    this._size.reset();
    this._buckle.reset();
    this._engraving.reset();
    this._text.reset();
    this._material.reset();
  }
}
