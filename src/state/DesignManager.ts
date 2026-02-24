import { makeAutoObservable } from 'mobx';

import { StateManager } from './StateManager';
import { ViewManager } from './ViewManager';

export class DesignManager {
  private _libState: StateManager;
  private _viewManager: ViewManager;

  constructor(libState: StateManager) {
    this._libState = libState;
    this._viewManager = new ViewManager(libState);
    makeAutoObservable(this);
  }

  get viewManager() {
    return this._viewManager;
  }
}
