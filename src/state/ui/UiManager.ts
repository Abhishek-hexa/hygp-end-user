import { makeAutoObservable } from 'mobx';

export class UiManager {
  private _isDataLoading = false;
  private _dataError: string | null = null;
  private _isBulkMode = false;
  private _3dLoadingItems = new Set<string>();

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

  get is3DLoading() {
    return this._3dLoadingItems.size > 0;
  }

  add3DLoadingItem(id: string) {
    this._3dLoadingItems.add(id);
  }

  remove3DLoadingItem(id: string) {
    console.log('3d Loading')
    this._3dLoadingItems.delete(id);
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
