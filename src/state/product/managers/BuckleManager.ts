import { makeAutoObservable } from 'mobx';

import { BuckleType } from '../types';

export class BuckleManager {
  private _type: BuckleType | null = null;
  private _availableBuckles: BuckleType[] | null = null;

  private _selectedColor: string | null = null;
  private _metalColors: string[] | null = null;
  private _plasticColors: string[] | null = null;
  private _breakawayColors: string[] | null = null;

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

  get selectedColor() {
    return this._selectedColor;
  }

  setType(type: BuckleType) {
    this._type = type;
  }

  setAvailableBuckles(inAvailableBuckles: BuckleType[]) {
    this._availableBuckles = inAvailableBuckles;
  }

  setMetalColors(inMetalColors: string[]) {
    this._metalColors = inMetalColors;
  }

  setPlasticColors(inPlasticColors: string[]) {
    this._plasticColors = inPlasticColors;
  }

  setBreakawayColors(inBreakawayColors: string[]) {
    this._breakawayColors = inBreakawayColors;
  }

  setSelectedColor(color: string) {
    this._selectedColor = color;
  }

  reset() {
    this._type = null;
  }
}
