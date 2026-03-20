import { makeAutoObservable } from 'mobx';

import { DesignManager } from './design/DesignManager';
import { Design3DManager } from './design3d/Design3DManager';
import { UiManager } from './ui/UiManager';

export class StateManager {
  constructor() {
    makeAutoObservable(this);
  }

  private _designManager = new DesignManager(this);
  private _design3DManager = new Design3DManager(this);
  private _uiManager = new UiManager();

  get designManager() {
    return this._designManager;
  }

  get uiManager() {
    return this._uiManager;
  }

  get design3DManager() {
    return this._design3DManager;
  }
}
