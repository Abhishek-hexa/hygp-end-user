import { makeAutoObservable } from 'mobx';

import { TextSize } from '../types';
import { FontManager } from './FontManager';

export class TextManager {
  private _value = '';
  private _size: TextSize = 'medium';
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

  setText(value: string) {
    this._value = value;
  }

  setSize(size: TextSize) {
    this._size = size;
  }

  setFont(font: string) {
    this._font.setFont(font);
  }

  reset() {
    this._value = '';
    this._size = 'medium';
    this._font.reset();
  }
}
