import { makeAutoObservable } from 'mobx';

export class EngravingManager {
  private _lines: string[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get lines() {
    return this._lines;
  }

  setLines(lines: string[]) {
    this._lines = [...lines];
  }

  reset() {
    this._lines = [];
  }
}
