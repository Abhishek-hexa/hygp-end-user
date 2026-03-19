import { makeAutoObservable } from 'mobx';

import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { SizeManager } from './managers/SizeManager';
import { TextureManager } from './managers/TextureManager';
import { WebbingTextManager } from './managers/WebbingTextManager';
import { defaultProductId, productConfigs } from './productConfig';
import {
  Features,
  SerializedProductConfiguration,
  ProductType,
} from './types';

export class ProductManager {
  private _productId: ProductType = defaultProductId;
  private _activeFeature: Features | null = null;
  private _sizeManager = new SizeManager();
  private _buckleManager = new BuckleManager();
  private _engravingManager = new EngravingManager();
  private _webbingTextManager = new WebbingTextManager();
  private _textureManager = new TextureManager();

  constructor() {
    makeAutoObservable(this);
    this._activeFeature = this.getAllFeatures()[0] ?? null;
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

  get activeFeature() {
    return this._activeFeature;
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
    this._activeFeature = this.getAllFeatures()[0] ?? null;
    this.reset();
    this._buckleManager.setProductId(inProductId);
  }

  getAllFeatures() {
    return this.productConfig.features;
  }

  setActiveFeature(feature: Features | null) {
    this._activeFeature = feature;
  }

  serializeConfiguration(): SerializedProductConfiguration {
    const productConfig: SerializedProductConfiguration = {
      key: globalThis.crypto.randomUUID(),
      productId: this._productId,
      price: this.sizeManager.totalPrice,
      qty: 1,
      size: {
        size: this.sizeManager.selectedSize,
        length: this.sizeManager.selectedLength,
      },
      buckle: {
        material: this.buckleManager.material,
        color: this.buckleManager.selectedColor,
      },
      engraving: {
        lines: this.engravingManager.lines.map((line) => ({ ...line })),
      },
      webbing: {
        value: this.webbingText.value,
        size: this.webbingText.size,
        font: this.webbingText.selectedFont,
        color: this.webbingText.selectedColor,
      },
      texture: {
        pattern: this.textureManager.selectedPatternId,
        collections: this.textureManager.selectedCollectionIds[0],
      }
    };

    this.resetSelections();

    return productConfig;
  }

  reset() {
    this._sizeManager.reset();
    this._buckleManager.reset();
    this._engravingManager.reset();
    this._webbingTextManager.reset();
    this._textureManager.reset();
  }

  resetSelections() {
    this._sizeManager.resetSelection();
    this._buckleManager.resetSelection();
    this._engravingManager.resetSelection();
    this._webbingTextManager.resetSelection();
    this._textureManager.resetSelection();
  }
}
