import { makeAutoObservable } from 'mobx';

import { TextSize } from '../types';
import { FontManager } from './FontManager';

export class WebbingTextManager {
  private _value = '';
  private _size: TextSize = 'MEDIUM';
  private _font = new FontManager();

  constructor() {
    makeAutoObservable(this);
  }

  get value() {
    return this._value;
  }

  get size() {
    return this._size;
  }

  get font() {
    return this._font;
  }

  get availableFonts() {
    return this._font.availableFonts;
  }

  get selectedFont() {
    return this._font.selectedFont;
  }

  setText(inValue: string) {
    this._value = inValue;
  }

  setSize(inSize: TextSize) {
    this._size = inSize;
  }

  setFont(inFont: string) {
    this._font.setFont(inFont);
  }

  reset() {
    this._value = '';
    this._size = 'MEDIUM';
    this._font.reset();
  }
}
