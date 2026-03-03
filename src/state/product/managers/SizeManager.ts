import { makeAutoObservable } from 'mobx';

import { LeashLengthType, ProductSizeType } from '../types';

export class SizeManager {
  private _selectedSize: ProductSizeType | null = null;
  private _availableSizes: ProductSizeType[] = [];

  private _selectedLength: LeashLengthType | null = null;
  private _availableLengths: LeashLengthType[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get selectedSize() {
    return this._selectedSize;
  }

  get availableSizes() {
    return this._availableSizes;
  }

  get selectedLength() {
    return this._selectedLength;
  }

  get availableLengths() {
    return this._availableLengths;
  }

  setSize(size: ProductSizeType) {
    this._selectedSize = size;
  }

  setAvailableSizes(sizes: ProductSizeType[]) {
    this._availableSizes = sizes;
  }

  setLength(length: LeashLengthType) {
    this._selectedLength = length;
  }

  setAvailableLengths(lengths: LeashLengthType[]) {
    this._availableLengths = lengths;
  }

  reset() {
    this._selectedSize = null;
  }
}
