import { makeAutoObservable } from 'mobx';

import { ApiBuckleOption } from '../../../api/types';
import { BuckleType } from '../types';

export class BuckleManager {
  private _type: BuckleType | null = null;
  private _finishColor: string | null = null;
  private _options: ApiBuckleOption[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  get type() {
    return this._type;
  }

  get finishColor() {
    return this._finishColor;
  }

  get options() {
    return this._options;
  }

  get finishColors() {
    const colors = this._options.map((option) => this.resolveOptionColor(option));
    return Array.from(new Set(colors.filter(Boolean)));
  }

  setType(type: BuckleType) {
    this._type = type;
    const colors = this.finishColors;

    if (!colors.length) {
      this._finishColor = null;
      return;
    }

    if (!this._finishColor || !colors.includes(this._finishColor)) {
      this._finishColor = colors[0];
    }
  }

  setFinishColor(color: string) {
    this._finishColor = color;
  }

  setOptions(options: ApiBuckleOption[]) {
    this._options = Array.isArray(options) ? options : [];

    if (!this._type) {
      this._type = 'METAL';
    }
    const colors = this.finishColors;

    if (!colors.length) {
      this._finishColor = null;
      return;
    }

    if (!this._finishColor || !colors.includes(this._finishColor)) {
      this._finishColor = colors[0];
    }
  }

  reset() {
    this._type = null;
    this._finishColor = null;
    this._options = [];
  }

  private resolveOptionColor(option: ApiBuckleOption) {
    if (this._type === 'METAL') {
      return option.metalColor ?? option.previewColor ?? option.colors[0] ?? '';
    }

    if (this._type === 'PLASTIC' || this._type === 'BREAKAWAY') {
      return option.plasticColor ?? option.previewColor ?? option.colors[0] ?? '';
    }

    return option.previewColor ?? option.colors[0] ?? '';
  }
}
