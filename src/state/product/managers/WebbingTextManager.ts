import { makeAutoObservable } from 'mobx';

import { FontDescription, TextSize } from '../types';

const DEFAULT_TEXT_COLOR = '#374b67';

export class WebbingTextManager {
  private _value = '';
  private _size: TextSize = 'MEDIUM';
  private _availableFonts: Map<number, FontDescription> = new Map();
  private _selectedFont: number | null = null;
  private _selectedColor = DEFAULT_TEXT_COLOR;
  private _selectedFontName: string = '';

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

  get selectedFontDescription() {
    if (!this.selectedFont) return;
    return this.availableFonts.get(this.selectedFont);
  }

  get selectedFontName() {
    return this._selectedFontName;
  }

  setText(inValue: string) {
    this._value = inValue;
  }

  setSize(inSize: TextSize) {
    this._size = inSize;
  }

  setFont(inFont: number) {
    this._selectedFont = inFont;
    const font = this._availableFonts.get(inFont);
    this._selectedFontName = font?.name ?? '';
  }

  setColor(inColor: string) {
    this._selectedColor = inColor;
  }

  setAvailableFonts(inAvailableFonts: Map<number, FontDescription>) {
    this._availableFonts = inAvailableFonts;
    const firstEntry = inAvailableFonts.entries().next().value;
    if (firstEntry) {
      this._selectedFont = firstEntry[0];
      this._selectedFontName = firstEntry[1].name ?? '';
    } else {
      this._selectedFont = null;
      this._selectedFontName = '';
    }
  }

  resetSelection() {
    this._value = '';
    this._size = 'MEDIUM';
    this._selectedColor = DEFAULT_TEXT_COLOR;

    // Reset to first available font, not null
    const firstEntry = this._availableFonts.entries().next().value;
    if (firstEntry) {
      this._selectedFont = firstEntry[0];
      this._selectedFontName = firstEntry[1].name ?? '';
    } else {
      this._selectedFont = null;
      this._selectedFontName = '';
    }
  }

  reset() {
    this._value = '';
    this._size = 'MEDIUM';
    this._availableFonts = new Map();
    this._selectedFont = null;
    this._selectedFontName = '';
    this._selectedColor = DEFAULT_TEXT_COLOR;
  }
}
