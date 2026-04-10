import { makeAutoObservable, runInAction } from 'mobx';

export interface Product3DLoadSession {
  loaderId: string;
  shouldShowLoader: boolean;
  productKey: string | null;
}

export class UiManager {
  private _isDataLoading = false;
  private _dataError: string | null = null;
  private _isBulkMode = false;
  private _isDefaultLoaded = false;
  private _3dLoadingItems = new Set<string>();
  private _is3DLoadingDebounced = false;
  private _loadingDebounceTimer: ReturnType<typeof setTimeout> | null = null;
  private _hasCompletedInitialProductLoad = false;
  private _lastLoadedProductKey: string | null = null;
  private _loadedProductKeys = new Set<string | null>();
  private _bootLoaderCounter = 0;
  private _isStartAnimationComplete = false;

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

  get isDefaultLoaded() {
    return this._isDefaultLoaded;
  }

  get is3DLoading() {
    return this._is3DLoadingDebounced;
  }

  get isCanvasVisible() {
    return !this.is3DLoading && !this.isDataLoading;
  }

  get isStartAnimationComplete() {
    return this._isStartAnimationComplete;
  }

  setStartAnimationComplete(isComplete: boolean) {
    this._isStartAnimationComplete = isComplete;
  }

  beginProduct3DLoad(productKey?: string | null): Product3DLoadSession {
    const resolvedProductKey = productKey ?? null;
    const shouldShowLoader =
      !this._hasCompletedInitialProductLoad ||
      !this._loadedProductKeys.has(resolvedProductKey);
    const loaderId = `bootLoader${this._bootLoaderCounter}`;

    this._bootLoaderCounter++;

    if (shouldShowLoader) {
      this.add3DLoadingItem(loaderId);
    }

    return {
      loaderId,
      shouldShowLoader,
      productKey: resolvedProductKey,
    };
  }

  finishProduct3DLoad(session: Product3DLoadSession, commit = true) {
    if (session.shouldShowLoader) {
      this.remove3DLoadingItem(session.loaderId);
    }

    if (commit) {
      this._hasCompletedInitialProductLoad = true;
      this._lastLoadedProductKey = session.productKey;
      this._loadedProductKeys.add(session.productKey);
    }
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

  setDefaultLoaded(inIsDefaultLoaded: boolean) {
    this._isDefaultLoaded = inIsDefaultLoaded;
  }
}
