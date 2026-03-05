import { makeAutoObservable } from 'mobx';

export interface EngravingLine {
  text: string;
  font: string;
}

export class EngravingManager {
  private static readonly MAX_LINES = 4;
  private _lines: EngravingLine[] = [];
  private _availableFonts: Map<string, string> = new Map();

  constructor() {
    makeAutoObservable(this);
  }

  get lines() {
    return this._lines;
  }

  get availableFonts() {
    return this._availableFonts;
  }

  setLines(inLines: EngravingLine[]) {
    if (inLines.length > EngravingManager.MAX_LINES) {
      return;
    }
    this._lines = inLines;
  }

  setAvailableFonts(inFonts: Map<string, string>) {
    this._availableFonts = inFonts;
  }

  reset() {
    this._lines = [];
    this._availableFonts = new Map();
  }
}
