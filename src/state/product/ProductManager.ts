import { makeAutoObservable } from 'mobx';

import {
  ApiCollection,
  ApiPattern,
  ApiProductVariant,
} from '../../api/types';
import { BuckleManager } from './managers/BuckleManager';
import { EngravingManager } from './managers/EngravingManager';
import { TextureManager } from './managers/MaterialManager';
import { SizeManager } from './managers/SizeManager';
import { TextManager } from './managers/TextManager';
import { defaultProductId, productConfigs } from './productConfig';
import { ConfiguratorTab, ProductId } from './types';

export class ProductManager {
  private _productId: ProductId = defaultProductId;
  private _size = new SizeManager();
  private _buckle = new BuckleManager();
  private _engraving = new EngravingManager();
  private _text = new TextManager();
  private _material = new TextureManager();
  private _backendVariants: ApiProductVariant[] = [];
  private _backendCollections: ApiCollection[] = [];
  private _backendPatterns: ApiPattern[] = [];
  private _activeTab: ConfiguratorTab = 'size';
  private _selectedCollectionId = '';
  private _matchingLeash = 'No Leash';

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

  get backendVariants() {
    return this._backendVariants;
  }

  get backendCollections() {
    return this._backendCollections;
  }

  get backendPatterns() {
    return this._backendPatterns;
  }

  get activeTab() {
    return this._activeTab;
  }

  get selectedCollectionId() {
    return this._selectedCollectionId;
  }

  get matchingLeash() {
    return this._matchingLeash;
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

  setBackendVariants(variants: ApiProductVariant[]) {
    this._backendVariants = Array.isArray(variants) ? variants : [];
  }

  setBackendCollections(collections: ApiCollection[]) {
    this._backendCollections = Array.isArray(collections) ? collections : [];
  }

  setBackendPatterns(patterns: ApiPattern[]) {
    this._backendPatterns = Array.isArray(patterns) ? patterns : [];
  }

  setActiveTab(tab: ConfiguratorTab) {
    this._activeTab = tab;
  }

  setSelectedCollectionId(collectionId: string) {
    this._selectedCollectionId = collectionId;
  }

  setMatchingLeash(value: string) {
    this._matchingLeash = value;
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
    this._backendVariants = [];
    this._backendCollections = [];
    this._backendPatterns = [];
    this._activeTab = 'size';
    this._selectedCollectionId = '';
    this._matchingLeash = 'No Leash';
  }
}
