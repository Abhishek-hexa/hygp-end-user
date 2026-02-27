import { makeAutoObservable } from 'mobx';

import { ApiFontOption } from '../../../api/types';
import { FontManager } from './FontManager';

export class EngravingManager {
  private _lines: string[] = [];
  private _font = new FontManager();

  constructor() {
    makeAutoObservable(this);
  }

  get lines() {
    return this._lines;
  }

  get font() {
    return this._font;
  }

  setLines(lines: string[]) {
    this._lines = [...lines];
  }

  setFont(font: string) {
    this._font.setFont(font);
  }

  setAvailableFonts(fonts: ApiFontOption[]) {
    this._font.setAvailableFonts(filterFontsByUseCase(fonts, 'buckle'));
  }

  reset() {
    this._lines = [];
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
