import { makeAutoObservable } from 'mobx';

import { LeashLengthType, ProductSizeType, SizeDescription } from '../types';

export class SizeManager {
  private _selectedSizeData: SizeDescription | null = null;
  private _availableSizes: Map<ProductSizeType, SizeDescription> = new Map(); // Size : Description

  private _selectedLength: LeashLengthType | null = null;
  private _availableLengths: LeashLengthType[] = [];
  private _lengthPrices: Map<LeashLengthType, string> = new Map();

  constructor() {
    makeAutoObservable(this);
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

  get lengthPrices() {
    return this._lengthPrices;
  }

  get selectedSizeData() {
    return this._selectedSizeData;
  }

  get totalPrice() {
    const lengthPrice = this._selectedLength
      ? (this._lengthPrices.get(this._selectedLength) ?? '0')
      : '0';
    const sizePrice = this._selectedSizeData?.price ?? '0';
    return String((parseFloat(lengthPrice) + parseFloat(sizePrice)).toFixed(2));
  }

  get allModels() {
    const uniqueModels = new Set<string>();
    Array.from(this._availableSizes.values()).forEach((desc) => {
      if (desc.model) {
        uniqueModels.add(desc.model);
      }
      if (desc.plasticModel) {
        uniqueModels.add(desc.plasticModel);
      }
    });
    return Array.from(uniqueModels);
  }

  setSelectedSizeData(sizeData: SizeDescription | null) {
    this._selectedSizeData = sizeData;
  }

  setAvailableSizes(inSizes: Map<ProductSizeType, SizeDescription>) {
    this._availableSizes = inSizes;
    const firstKey = inSizes.keys().next().value ?? null;
    this._selectedSizeData = firstKey ? (inSizes.get(firstKey) ?? null) : null;
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

  setLengthPrices(inLengthPrices: Map<LeashLengthType, string>) {
    this._lengthPrices = inLengthPrices;
  }

  resetSelection() {
    this._selectedSizeData = this._availableSizes.values().next().value || null;
    this._selectedLength = null;
  }

  reset() {
    this._selectedLength = null;
    this._availableSizes.clear();
    this._availableLengths = [];
    this._lengthPrices.clear();
  }
}
