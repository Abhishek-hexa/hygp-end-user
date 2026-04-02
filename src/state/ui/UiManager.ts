import { makeAutoObservable, runInAction } from 'mobx';

export class UiManager {
  private _isDataLoading = false;
  private _dataError: string | null = null;
  private _isBulkMode = false;
  private _3dLoadingItems = new Set<string>();
  private _is3DLoadingDebounced = false;
  private _loadingDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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
    return this._is3DLoadingDebounced;
  }

  add3DLoadingItem(id: string) {
    this._3dLoadingItems.add(id);
    if (this._loadingDebounceTimer !== null) {
      clearTimeout(this._loadingDebounceTimer);
      this._loadingDebounceTimer = null;
    }
    this._is3DLoadingDebounced = true;
  }

  remove3DLoadingItem(id: string) {
    this._3dLoadingItems.delete(id);
    if (this._3dLoadingItems.size === 0) {
      // Debounce the "loading finished" state to prevent flicker
      // when one loader finishes right before another starts.
      if (this._loadingDebounceTimer !== null) {
        clearTimeout(this._loadingDebounceTimer);
      }
      this._loadingDebounceTimer = setTimeout(() => {
        runInAction(() => {
          if (this._3dLoadingItems.size === 0) {
            this._is3DLoadingDebounced = false;
          }
          this._loadingDebounceTimer = null;
        });
      }, 100);
    }
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
