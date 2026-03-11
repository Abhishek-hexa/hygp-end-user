import { makeAutoObservable } from 'mobx';

import { LeashLengthType, ProductSizeType, SizeDescription } from '../types';

export class SizeManager {
  private _selectedSize: ProductSizeType | null = null;
  private _availableSizes: Map<ProductSizeType, SizeDescription> = new Map(); // Size : Description

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

  setSize(inSize: ProductSizeType) {
    this._selectedSize = inSize;
  }

  setAvailableSizes(inSizes: Map<ProductSizeType, SizeDescription>) {
    this._availableSizes = inSizes;
    this._selectedSize = this._availableSizes.keys().next().value || null;
  }

  setLength(inLength: LeashLengthType | null) {
    this._selectedLength = inLength;
  }

  setAvailableLengths(inLengths: LeashLengthType[]) {
    this._availableLengths = inLengths;
    if (
      this._selectedLength &&
      !this._availableLengths.includes(this._selectedLength)
    ) {
      this._selectedLength = null;
    }
  }

  reset() {
    this._selectedSize = null;
    this._selectedLength = null;
    this._availableSizes.clear();
    this._availableLengths = [];
  }
}
