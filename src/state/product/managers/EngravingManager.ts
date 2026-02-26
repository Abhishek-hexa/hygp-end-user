import { makeAutoObservable } from 'mobx';

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

  reset() {
    this._lines = [];
    this._font.reset();
  }
}
