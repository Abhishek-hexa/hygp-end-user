import { makeAutoObservable } from 'mobx';

export class UiManager {
  private _isDataLoading = false;
  private _dataError: string | null = null;
  private _isBulkMode = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isDataLoading() {
    return this._isDataLoading;
  }

  get dataError() {
    return this._dataError;
  }

  get isBulkMode() {
    return this._isBulkMode;
  }

  setDataLoading(inDataLoading: boolean) {
    this._isDataLoading = inDataLoading;
  }

  setDataError(inDataError: string | null) {
    this._dataError = inDataError;
  }

  setBulkMode(inIsBulkMode: boolean) {
    this._isBulkMode = inIsBulkMode;
  }
}
