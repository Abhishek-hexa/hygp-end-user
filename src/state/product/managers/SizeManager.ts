import { makeAutoObservable } from 'mobx';

import { ProductSize } from '../types';

export class SizeManager {
  private _selectedSize: ProductSize | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get selectedSize() {
    return this._selectedSize;
  }

  setSize(size: ProductSize) {
    this._selectedSize = size;
  }

  reset() {
    this._selectedSize = null;
  }
}
