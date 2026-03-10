import { makeAutoObservable } from 'mobx';

import { BuckleType, ColorDescription } from '../types';

export class BuckleManager {
  private _type: BuckleType | null = null;
  private _availableBuckles: BuckleType[] = [];

  private _selectedColor: number | null = null;
  private _metalColors: ColorDescription[] = [];
  private _plasticColors: ColorDescription[] = [];
  private _breakawayColors: ColorDescription[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get type() {
    return this._type;
  }

  get availableBuckles() {
    return this._availableBuckles;
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
    if (this._type === 'METAL') {
      return this._metalColors;
    }
    if (this._type === 'PLASTIC') {
      return this._plasticColors;
    }
    if (this._type === 'BREAKAWAY') {
      return this._breakawayColors;
    }

    return [];
  }

  get selectedColor() {
    return this._selectedColor;
  }

  setType(inType: BuckleType) {
    this._type = inType;
  }

  setAvailableBuckles(inAvailableBuckles: BuckleType[]) {
    this._availableBuckles = inAvailableBuckles;
  }

  setMetalColors(inMetalColors: ColorDescription[]) {
    this._metalColors = inMetalColors;
  }

  setPlasticColors(inPlasticColors: ColorDescription[]) {
    this._plasticColors = inPlasticColors;
  }

  setBreakawayColors(inBreakawayColors: ColorDescription[]) {
    this._breakawayColors = inBreakawayColors;
  }

  setSelectedColor(inColor: number) {
    this._selectedColor = inColor;
  }

  reset() {
    this._type = null;
    this._availableBuckles = [];
    this._selectedColor = null;
    this._metalColors = [];
    this._plasticColors = [];
    this._breakawayColors = [];
  }
}
