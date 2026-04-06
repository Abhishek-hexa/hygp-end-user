import { useEffect, useRef } from 'react';
import { reaction } from 'mobx';

import { CachedAssets } from '../../loaders/CachedAssets';
import { useMainContext } from './../useMainContext';

const OTHER_TEXTURES = [
  '/assets/texture/texture/plasticLogo.png',
];
const OTHER_HDRS = ['/assets/texture/texture/photo_studio_01_1k.hdr'];

const loadAllModels = async (modelUrls: string[]) => {
  await Promise.allSettled(
    modelUrls.map((modelUrl) => CachedAssets.loadModel(modelUrl)),
  );
};

const loadOtherHdrs = async (hdrUrls: string[]) => {
  await Promise.allSettled(
    hdrUrls.map((hdrUrl) => CachedAssets.loadHdr(hdrUrl)),
  );
};

const loadOtherTextures = async (textureUrls: string[]) => {
  await Promise.allSettled(
    textureUrls.map((textureUrl) => CachedAssets.loadTexture(textureUrl)),
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
        void Promise.allSettled([
          loadAllModels(productManager.allModels),
          loadOtherTextures(OTHER_TEXTURES),
          loadOtherHdrs(OTHER_HDRS),
        ]);
      },
      {
        fireImmediately: true,
      },
    );

    return () => disposer();
  }, [productManager, uiManager]);
};
