import { makeAutoObservable } from 'mobx';

import { DesignManager } from './design/DesignManager';
import { Design3DManager } from './design3d/Design3DManager';

export class StateManager {
  constructor() {
    makeAutoObservable(this);
  }

  private _designManager = new DesignManager(this);

  get designManager() {
    return this._designManager;
  }

  private _design3DManager = new Design3DManager(this);

  get design3DManager() {
    return this._design3DManager;
  }
}
