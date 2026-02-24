import { makeAutoObservable } from 'mobx';

import { BuckleType } from '../types';

export class BuckleManager {
  private _type: BuckleType | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  get type() {
    return this._type;
  }

  setType(type: BuckleType) {
    this._type = type;
  }

  reset() {
    this._type = null;
  }
}
