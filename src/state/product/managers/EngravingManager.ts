import { makeAutoObservable } from 'mobx';

import { FontDescription, SerializedEngravingLine } from '../types';

export interface EngravingLine {
  text: string;
  font: number | null;
  fontName: string;
  isStretched: boolean;
}

export class EngravingManager {
  static readonly MAX_LINES = 4;
  static readonly MAX_CHARACTERS = 20;
  private static readonly DEFAULT_LINE_TEXTS = [
    'PET NAME',
    'Phone Number 1',
    'Phone Number 2',
    '',
  ];
  private _isEnabled = true;
  private _lines: EngravingLine[] = this.createDefaultLines();
  private _availableFonts: Map<number, FontDescription> = new Map();
  private _activeLineIndex = 0;
  private _shouldClearDefaultsOnInputInteraction = true;

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

  get isEnabled() {
    return this._isEnabled;
  }

  setEnabled(inIsEnabled: boolean) {
    this._isEnabled = inIsEnabled;
    this._lines = inIsEnabled
      ? this.createDefaultLines()
      : this.createEmptyLines();
    this._activeLineIndex = 0;
    this._shouldClearDefaultsOnInputInteraction = inIsEnabled;
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
          fontName: inLine?.fontName ?? '',
          isStretched: inLine?.isStretched ?? false,
          text: (inLine?.text ?? '').slice(0, EngravingManager.MAX_CHARACTERS),
        };
      },
    );
    this._shouldClearDefaultsOnInputInteraction = false;
  }

  setLineText(inIndex: number, inText: string) {
    if (inIndex < 0 || inIndex >= EngravingManager.MAX_LINES) {
      return;
    }

    this._lines[inIndex] = {
      ...this._lines[inIndex],
      text: inText.slice(0, EngravingManager.MAX_CHARACTERS),
    };
    this._shouldClearDefaultsOnInputInteraction = false;
  }

  setLineFont(inIndex: number, inFontId: number) {
    if (inIndex < 0 || inIndex >= EngravingManager.MAX_LINES) return;
    if (!this._availableFonts.has(inFontId)) return;

    const font = this._availableFonts.get(inFontId);

    this._lines[inIndex] = {
      ...this._lines[inIndex],
      font: inFontId,
      fontName: font?.name ?? '',
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
    if (!this._isEnabled) return;

    const firstEntry = inFonts.entries().next().value;
    if (!firstEntry) return;

    const [defaultFontId, defaultFont] = firstEntry;
    this._lines.forEach((line) => {
      line.font = defaultFontId;
      line.fontName = defaultFont?.name ?? '';
    });
  }

  clearDefaultsOnInputInteraction() {
    if (!this._isEnabled) {
      return;
    }
    if (!this._shouldClearDefaultsOnInputInteraction) {
      return;
    }

    this._lines = this._lines.map((line) => ({
      ...line,
      text: '',
    }));
    this._shouldClearDefaultsOnInputInteraction = false;
  }

  getSerializableLines(): SerializedEngravingLine[] {
    const sendEmpty = this._shouldClearDefaultsOnInputInteraction;

    return this._lines.map((line) => ({
      font: line.font,
      fontName: line.fontName,
      isStretched: line.isStretched,
      text: sendEmpty ? '' : line.text, // if never touched, send empty
    }));
  }

  resetSelection() {
    this._lines = this._isEnabled
      ? this.createDefaultLines()
      : this.createEmptyLines();
    this._activeLineIndex = 0;
    this._shouldClearDefaultsOnInputInteraction = this._isEnabled;

    const firstEntry = this._availableFonts.entries().next().value;
    if (firstEntry && this._isEnabled) {
      const [defaultFontId, defaultFont] = firstEntry;
      this._lines.forEach((line) => {
        line.font = defaultFontId;
        line.fontName = defaultFont?.name ?? '';
      });
    }
  }
  reset() {
    this._lines = this._isEnabled
      ? this.createDefaultLines()
      : this.createEmptyLines();
    this._availableFonts = new Map();
    this._activeLineIndex = 0;
    this._shouldClearDefaultsOnInputInteraction = this._isEnabled;
  }

  private createDefaultLines() {
    return Array.from({ length: EngravingManager.MAX_LINES }, (_, index) => ({
      font: null,
      fontName: '',
      isStretched: false,
      text: (EngravingManager.DEFAULT_LINE_TEXTS[index] ?? '').slice(
        0,
        EngravingManager.MAX_CHARACTERS,
      ),
    }));
  }

  private createEmptyLines() {
    return Array.from({ length: EngravingManager.MAX_LINES }, () => ({
      font: null,
      fontName: '',
      isStretched: false,
      text: '',
    }));
  }
}
