import { makeAutoObservable } from 'mobx';

import { ApiFontOption } from '../../../api/types';
import { TextSize } from '../types';
import { FontManager } from './FontManager';

export class TextManager {
  private _value = '';
  private _size: TextSize = 'medium';
  private _color = '#2f3f57';
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

  get color() {
    return this._color;
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

  setColor(color: string) {
    this._color = color;
  }

  setFont(font: string) {
    this._font.setFont(font);
  }

  setAvailableFonts(fonts: ApiFontOption[]) {
    this._font.setAvailableFonts(filterFontsByUseCase(fonts, 'webbing'));
  }

  reset() {
    this._value = '';
    this._size = 'medium';
    this._color = '#2f3f57';
    this._font.reset();
  }
}

const filterFontsByUseCase = (
  fonts: ApiFontOption[],
  useCase: 'webbing' | 'buckle',
) =>
  fonts.filter((font) => {
    if (!font.useCases || font.useCases.length === 0) {
      return true;
    }

    return font.useCases.some((entry) => entry.toLowerCase() === useCase);
  });
