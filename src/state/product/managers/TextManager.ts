import { makeAutoObservable } from 'mobx';

import { TextSize } from '../types';

export class TextManager {
  private _value = '';
  private _size: TextSize = 'medium';

  constructor() {
    makeAutoObservable(this);
  }

  get value() {
    return this._value;
  }

  get size() {
    return this._size;
  }

  setText(value: string) {
    this._value = value;
  }

  setSize(size: TextSize) {
    this._size = size;
  }

  reset() {
    this._value = '';
    this._size = 'medium';
  }
}
