import { makeAutoObservable } from 'mobx';

import { ApiProductVariant } from '../../../api/types';
import { ProductSize } from '../types';

export class SizeManager {
  private _selectedSize: ProductSize | null = null;
  private _backendVariants: ApiProductVariant[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get selectedSize() {
    return this._selectedSize;
  }

  get backendVariants() {
    return this._backendVariants;
  }

  setSize(size: ProductSize) {
    this._selectedSize = size;
  }

  setBackendVariants(variants: ApiProductVariant[]) {
    this._backendVariants = Array.isArray(variants) ? variants : [];
  }

  reset() {
    this._selectedSize = null;
    this._backendVariants = [];
  }
}
