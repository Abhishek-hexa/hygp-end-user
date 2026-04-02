import { makeAutoObservable } from 'mobx';

import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { SizeManager } from './managers/SizeManager';
import { TextureManager } from './managers/TextureManager';
import { WebbingTextManager } from './managers/WebbingTextManager';
import { defaultProductId, productConfigs } from './productConfig';
import { Features, ProductType, SerializedProductConfiguration } from './types';

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

  get activeModelKey() {
    const key =
      this.productId === 'DOG_COLLAR' &&
      this.buckleManager.material === 'PLASTIC' &&
      this.plasticModelPath
        ? this.plasticModelPath
        : this.modelPath;
    return key;
  }

  get modelPath() {
    const selectedSize = this._sizeManager.selectedSizeData;
    if (!selectedSize) {
      return null;
    }

    return selectedSize?.model ?? null;
  }

  get plasticModelPath() {
    const selectedSize = this._sizeManager.selectedSizeData;
    if (!selectedSize) {
      return null;
    }

    return selectedSize?.plasticModel ?? null;
  }

  get allModels() {
    return this._sizeManager.allModels;
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
      buckle: {
        color: this.buckleManager.selectedColor,
        material: this.buckleManager.material,
      },
      engraving: {
        lines: this.engravingManager.lines.map((line) => ({ ...line })),
      },
      key: globalThis.crypto.randomUUID(),
      price: this.sizeManager.totalPrice,
      productId: this._productId,
      qty: 1,
      size: {
        length: this.sizeManager.selectedLength,
        size: this.sizeManager.selectedSizeData,
      },
      texture: {
        collections: this.textureManager.selectedCollectionIds[0],
        pattern: this.textureManager.selectedPatternId,
      },
      webbing: {
        color: this.webbingText.selectedColor,
        font: this.webbingText.selectedFont,
        size: this.webbingText.size,
        value: this.webbingText.value,
      },
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
