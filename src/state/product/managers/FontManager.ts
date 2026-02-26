import { makeAutoObservable } from 'mobx';

export class FontManager {
  private _selectedFont: string | null;

  constructor(defaultFont: string | null = null) {
    this._selectedFont = defaultFont;
    makeAutoObservable(this);
  }

  get selectedFont() {
    return this._selectedFont;
  }

  setFont(font: string) {
    this._selectedFont = font;
  }

  clearFont() {
    this._selectedFont = null;
  }

  reset() {
    this.clearFont();
  }
}
