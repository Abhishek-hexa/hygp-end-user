import { makeAutoObservable } from 'mobx';

export class UiManager {
  private _isDataLoading = false;
  private _dataError: string | null = null; 

  constructor() {
    makeAutoObservable(this);
  }

  get isDataLoading() {
    return this._isDataLoading;
  }

  get dataError() {
    return this._dataError;
  }

  setDataLoading(inDataLoading: boolean) {
    this._isDataLoading = inDataLoading;
  }

  setDataError(inDataError: string | null) {
    this._dataError = inDataError;
  }
}
