import { CachedAssets } from '../loaders/CachedAssets';
import { useMainContext } from './useMainContext';

const _trackedModelLoads = new Map<string, Promise<unknown>>();

export function useMyGLTF(url: string) {
  const { uiManager } = useMainContext();
  const cached = CachedAssets.getModel(url);
  if (cached) return cached;

  const tracked = _trackedModelLoads.get(url);
  if (tracked) {
    throw tracked;
  }

  const status = CachedAssets.getModelStatus(url);
  // Track UI loading for any not-yet-loaded model, including in-flight loads
  // started by another caller.
  const shouldTrackWithUi = !status.isLoaded;
  if (shouldTrackWithUi) {
    uiManager.add3DLoadingItem(url);
  }

  const promise = CachedAssets
    .loadModel(url)
    .then((result) => {
      if (result.asset) return result.asset;
      throw result.error ?? new Error(`Failed to load model: ${url}`);
    })
    .finally(() => {
      _trackedModelLoads.delete(url);
      if (shouldTrackWithUi) {
        uiManager.remove3DLoadingItem(url);
      }
    });

  _trackedModelLoads.set(url, promise);
  throw promise;
}

useMyGLTF.preload = (url: string) => {
  void CachedAssets.loadModel(url).then(() => {});
};
