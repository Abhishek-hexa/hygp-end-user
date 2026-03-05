import { makeAutoObservable } from 'mobx';

import { TextSize } from '../types';
import { FontManager } from './FontManager';

export class WebbingTextManager {
  private _value = '';
  private _size: TextSize = 'MEDIUM';
  private _fontManager = new FontManager();

  constructor() {
    makeAutoObservable(this);
  }

  get value() {
    return this._value;
  }

  get size() {
    return this._size;
  }

  get fontManager() {
    return this._fontManager;
  }

  get availableFonts() {
    return this._fontManager.availableFonts;
  }

  get selectedFont() {
    return this._fontManager.selectedFont;
  }

  setText(inValue: string) {
    this._value = inValue;
  }

  setSize(inSize: TextSize) {
    this._size = inSize;
  }

  setFont(inFont: string) {
    this._fontManager.setFont(inFont);
  }

  reset() {
    this._value = '';
    this._size = 'MEDIUM';
    this._fontManager.reset();
  }
}
