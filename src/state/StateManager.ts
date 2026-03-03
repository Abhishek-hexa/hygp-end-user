import { makeAutoObservable } from 'mobx';

import { DesignManager } from './design/DesignManager';

export class StateManager {
  constructor() {
    makeAutoObservable(this);
  }

  private _designManager = new DesignManager(this);

  get designManager() {
    return this._designManager;
  }
}
