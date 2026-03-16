import { makeAutoObservable } from 'mobx';

import { DesignManager } from './design/DesignManager';
import { UiManager } from './ui/UiManager';

export class StateManager {
  constructor() {
    makeAutoObservable(this);
  }

  private _designManager = new DesignManager(this);
  private _uiManager = new UiManager();

  get designManager() {
    return this._designManager;
  }

  get uiManager() {
    return this._uiManager;
  }
}
