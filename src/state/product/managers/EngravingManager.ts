import { makeAutoObservable } from 'mobx';

import { FontDescription } from '../types';

export interface EngravingLine {
  text: string;
  font: number | null;
}

export class EngravingManager {
  static readonly MAX_LINES = 4;
  static readonly MAX_CHARACTERS = 20;
  private _lines: EngravingLine[] = Array.from(
    { length: EngravingManager.MAX_LINES },
    () => ({ font: null, text: '' }),
  );
  private _availableFonts: Map<number, FontDescription> = new Map();
  private _activeLineIndex = 0;

  constructor() {
    makeAutoObservable(this);
  }

  get lines() {
    return this._lines;
  }

  get availableFonts() {
    return this._availableFonts;
  }

  get activeLineIndex() {
    return this._activeLineIndex;
  }

  setLines(inLines: EngravingLine[]) {
    if (inLines.length > EngravingManager.MAX_LINES) {
      return;
    }

    this._lines = Array.from(
      { length: EngravingManager.MAX_LINES },
      (_, index) => {
        const inLine = inLines[index];
        return {
          font: inLine?.font ?? null,
          text: (inLine?.text ?? '').slice(0, EngravingManager.MAX_CHARACTERS),
        };
      },
    );
  }

  setLineText(inIndex: number, inText: string) {
    if (inIndex < 0 || inIndex >= EngravingManager.MAX_LINES) {
      return;
    }

    this._lines[inIndex] = {
      ...this._lines[inIndex],
      text: inText.slice(0, EngravingManager.MAX_CHARACTERS),
    };
  }

  setLineFont(inIndex: number, inFontId: number) {
    if (inIndex < 0 || inIndex >= EngravingManager.MAX_LINES) {
      return;
    }

    if (!this._availableFonts.has(inFontId)) {
      return;
    }

    this._lines[inIndex] = {
      ...this._lines[inIndex],
      font: inFontId,
    };
  }

  setActiveLine(inIndex: number) {
    if (inIndex < 0 || inIndex >= EngravingManager.MAX_LINES) {
      return;
    }

    this._activeLineIndex = inIndex;
  }

  setAvailableFonts(inFonts: Map<number, FontDescription>) {
    this._availableFonts = inFonts;

    const firstFont = this._availableFonts.keys().next().value;
    if (firstFont === undefined) {
      return;
    }

    this._lines = this._lines.map((line) => ({
      ...line,
      font: line.font ?? firstFont,
    }));
  }

  reset() {
    this._lines = Array.from({ length: EngravingManager.MAX_LINES }, () => ({
      font: null,
      text: '',
    }));
    this._availableFonts = new Map();
    this._activeLineIndex = 0;
  }
}
