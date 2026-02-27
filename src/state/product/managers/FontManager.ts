import { makeAutoObservable } from 'mobx';

import { ApiFontOption } from '../../../api/types';

export class FontManager {
  private _selectedFont: string | null;
  private _availableFonts: ApiFontOption[] = [];

  constructor(defaultFont: string | null = null) {
    this._selectedFont = defaultFont;
    makeAutoObservable(this);
  }

  get selectedFont() {
    return this._selectedFont;
  }

  get availableFonts() {
    return this._availableFonts;
  }

  setFont(font: string) {
    this._selectedFont = font;
  }

  setAvailableFonts(fonts: ApiFontOption[]) {
    this._availableFonts = Array.isArray(fonts) ? fonts : [];

    const hasSelected = this._availableFonts.some(
      (font) => font.family === this._selectedFont,
    );

    if (!hasSelected) {
      this._selectedFont = this._availableFonts[0]?.family ?? null;
    }
  }

  clearFont() {
    this._selectedFont = null;
  }

  reset() {
    this._availableFonts = [];
    this.clearFont();
  }
}
