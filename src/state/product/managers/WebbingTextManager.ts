import { makeAutoObservable } from 'mobx';

import { FontDescription, TextSize } from '../types';

const DEFAULT_TEXT_COLOR = '#374b67';

export class WebbingTextManager {
  private _value = '';
  private _size: TextSize = 'MEDIUM';
  private _availableFonts: Map<number, FontDescription> = new Map();
  private _selectedFont: number | null = null;
  private _selectedColor = DEFAULT_TEXT_COLOR;

  constructor() {
    makeAutoObservable(this);
  }

  get value() {
    return this._value;
  }

  get size() {
    return this._size;
  }

  get availableFonts() {
    return this._availableFonts;
  }

  get selectedFont() {
    return this._selectedFont;
  }

  get selectedColor() {
    return this._selectedColor;
  }

  setText(inValue: string) {
    this._value = inValue;
  }

  setSize(inSize: TextSize) {
    this._size = inSize;
  }

  setFont(inFont: number) {
    this._selectedFont = inFont;
  }

  setColor(inColor: string) {
    this._selectedColor = inColor;
  }

  setAvailableFonts(inAvailableFonts: Map<number, FontDescription>) {
    this._availableFonts = inAvailableFonts;
  }

  reset() {
    this._value = '';
    this._size = 'MEDIUM';
    this._availableFonts = new Map();
    this._selectedFont = null;
    this._selectedColor = DEFAULT_TEXT_COLOR;
  }
}
