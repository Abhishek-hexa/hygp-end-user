import { makeAutoObservable } from 'mobx';

import { BuckleMaterialType, ColorDescription, ProductType } from '../types';
import { defaultProductId, productConfigs } from '../productConfig';

export class BuckleManager {
  private _material: BuckleMaterialType | null = null;
  private _productId: ProductType =  defaultProductId;

  private _selectedColor: number | null = null;
  private _metalColors: ColorDescription[] = [];
  private _plasticColors: ColorDescription[] = [];
  private _breakawayColors: ColorDescription[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  private syncSelection() {
    const availableMaterials = this.availableBuckleMaterials;
    const hasCurrentMaterial =
      this._material !== null && availableMaterials.includes(this._material);

    if (!hasCurrentMaterial) {
      this._material = availableMaterials[0] ?? null;
    }

    const colors = this.currentColors;
    const hasSelectedColor = colors.some((color) => color.id === this._selectedColor);

    if (!hasSelectedColor) {
      this._selectedColor = colors[0]?.id ?? null;
    }
  }

  get material() {
    return this._material;
  }

  get availableBuckleMaterials() {
    return productConfigs[this._productId].buckleMaterials ?? [];
  }

  get metalColors() {
    return this._metalColors;
  }

  get plasticColors() {
    return this._plasticColors;
  }

  get breakawayColors() {
    return this._breakawayColors;
  }

  get currentColors() {
    if (this._material === 'PLASTIC') {
      return this._plasticColors;
    }
    return this._metalColors;
  }

  get selectedColor() {
    return this._selectedColor;
  }

  get productId() {
    return this._productId;
  }

  setMaterial(inMaterial: BuckleMaterialType) {
    this._material = inMaterial;
    this.syncSelection();
  }

  setProductId(inProductId: ProductType) {
    this._productId = inProductId;
    this.syncSelection();
  }

  setMetalColors(inMetalColors: ColorDescription[]) {
    this._metalColors = inMetalColors;
    this.syncSelection();
  }

  setPlasticColors(inPlasticColors: ColorDescription[]) {
    this._plasticColors = inPlasticColors;
    this.syncSelection();
  }

  setBreakawayColors(inBreakawayColors: ColorDescription[]) {
    this._breakawayColors = inBreakawayColors;
    this.syncSelection();
  }

  setSelectedColor(inColor: number) {
    this._selectedColor = inColor;
  }

  reset() {
    this._material = null;
    this._selectedColor = null;
    this._metalColors = [];
    this._plasticColors = [];
    this._breakawayColors = [];
  }
}
