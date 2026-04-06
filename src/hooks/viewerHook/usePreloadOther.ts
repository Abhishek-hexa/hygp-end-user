import { useEffect, useRef } from 'react';
import { reaction } from 'mobx';

import { CachedAssets } from '../../loaders/CachedAssets';
import { useMainContext } from './../useMainContext';

const loadAllModels = async (modelUrls: string[]) => {
  await Promise.allSettled(
    modelUrls.map((modelUrl) => CachedAssets.loadModel(modelUrl)),
  );
};

export const usePreloadOther = () => {
  const { designManager, uiManager } = useMainContext();
  const { productManager } = designManager;
  const preloadedSignature = useRef<string | null>(null);

  useEffect(() => {
    const disposer = reaction(
      () => ({
        key: productManager.productId,
        modelsKey: productManager.allModels.join('|'),
        isDataLoading: uiManager.isDataLoading,
        isDefaultLoaded: uiManager.isDefaultLoaded,
      }),
      ({ key, modelsKey, isDataLoading, isDefaultLoaded }) => {
        if (!isDefaultLoaded || isDataLoading || !modelsKey) {
          return;
        }

        const signature = `${key}:${modelsKey}`;
        if (preloadedSignature.current === signature) {
          return;
        }

        preloadedSignature.current = signature;
        void loadAllModels(productManager.allModels);
      },
      {
        fireImmediately: true,
      },
    );

    return () => disposer();
  }, [productManager, uiManager]);
};
