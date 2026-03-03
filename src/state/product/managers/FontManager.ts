import { makeAutoObservable } from 'mobx';

export class FontManager {
  private _selectedFont: string | null;
  private _id: number | null = null;
  private _availableFonts: Map<string, string> = new Map(); // font name and URL

  constructor(defaultFont: string | null = null) {
    this._selectedFont = defaultFont;
    makeAutoObservable(this);
  }

  get selectedFont() {
    return this._selectedFont;
  }

  get fontId() {
    return this._id;
  }

  get availableFonts() {
    return this._availableFonts;
  }

  setFont(font: string) {
    this._selectedFont = font;
  }

  setFontId(id: number) {
    this._id = id;
  }

  setAvailableFonts(fonts: Map<string, string>) {
    this._availableFonts = fonts;
  }

  clearFont() {
    this._selectedFont = null;
  }

  reset() {
    this.clearFont();
    this._availableFonts = new Map();
  }
}
