import { useEffect } from 'react';
import { reaction } from 'mobx';

import { CachedAssets } from '../loaders/CachedAssets';
import { ProductType } from '../state/product/types';
import { useMainContext } from './useMainContext';

interface Defaults {
  modelUrl: string | null;
  hdrs: string[];
  font: string | null;
  textures: string[];
}

const DEFAULT_HDRS = [
  '/assets/texture/texture/white1.hdr',
  '/assets/texture/texture/photo_studio_01_1k.hdr',
];

const PRODUCT_DEFAULT_NORMALS: Record<ProductType, string[]> = {
  BANDANA: ['/assets/texture/texture/webbingNormal.jpg'],
  CAT_COLLAR: ['/assets/texture/texture/webbingNormal.jpg'],
  DOG_COLLAR: ['/assets/texture/texture/webbingNormal.jpg'],
  HARNESS: [
    '/assets/texture/texture/base1Normal.webp',
    '/assets/texture/texture/base2Normal.webp',
    '/assets/texture/texture/beltNormal.webp',
    '/assets/texture/texture/bottomNormal.webp',
  ],
  LEASH: ['/assets/texture/texture/webbingNormal.jpg'],
  MARTINGALE: ['/assets/texture/texture/webbingNormal.jpg'],
};

const initializeDefaults = async (defaults: Defaults) => {
  const tasks: Promise<unknown>[] = [];

  if (defaults.modelUrl) {
    tasks.push(CachedAssets.loadModel(defaults.modelUrl));
  }

  defaults.textures.forEach((textureUrl) => {
    tasks.push(CachedAssets.loadTexture(textureUrl));
  });

  if (defaults.font) {
    tasks.push(CachedAssets.loadFont(defaults.font));
  }

  defaults.hdrs.forEach((hdrUrl) => {
    tasks.push(CachedAssets.loadHdr(hdrUrl));
  });

  await Promise.allSettled(tasks);
};

const loadAllModels = async (modelUrls: string[]) => {
  await Promise.allSettled(
    modelUrls.map((modelUrl) => CachedAssets.loadModel(modelUrl)),
  );
};

const hasUncachedDefaults = (defaults: Defaults) => {
  const modelPending = defaults.modelUrl
    ? (() => {
        const status = CachedAssets.getModelStatus(defaults.modelUrl);
        return !status.isLoaded && !status.isLoading;
      })()
    : false;

  const fontPending = defaults.font
    ? (() => {
        const status = CachedAssets.getFontStatus(defaults.font);
        return !status.isLoaded && !status.isLoading;
      })()
    : false;

  const hdrPending = defaults.hdrs.some((hdrUrl) => {
    const status = CachedAssets.getHdrStatus(hdrUrl);
    return !status.isLoaded && !status.isLoading;
  });

  const texturePending = defaults.textures.some((textureUrl) => {
    const status = CachedAssets.getTextureStatus(textureUrl);
    return !status.isLoaded && !status.isLoading;
  });

  return modelPending || fontPending || hdrPending || texturePending;
};

export const useHYGP = () => {
  const { designManager, uiManager } = useMainContext();
  const { productManager } = designManager;

  useEffect(() => {
    const disposer = reaction(
      () => ({
        key: productManager.productId,
        modelsKey: productManager.allModels.join('|'),
        modelPath: productManager.modelPath,
        selectedTexture:
          productManager.textureManager.selectedPattern?.pngImage ?? null,
        selectedFont:
          productManager.webbingText.selectedFontDescription?.font_path ?? null,
        isDataLoading: uiManager.isDataLoading,
        allModels: productManager.allModels,
      }),
      ({
        key,
        modelPath,
        selectedTexture,
        selectedFont,
        isDataLoading,
        allModels,
      }) => {
        const defaultNormals = PRODUCT_DEFAULT_NORMALS[key] ?? [];

        const defaults: Defaults = {
          font: selectedFont,
          hdrs: DEFAULT_HDRS,
          modelUrl: modelPath,
          textures: [
            ...defaultNormals,
            ...(selectedTexture ? [selectedTexture] : []),
          ],
        };

        const shouldTrackLoading = hasUncachedDefaults(defaults);
        if (shouldTrackLoading) {
          uiManager.add3DLoadingItem(key);
        }

        void initializeDefaults(defaults).finally(() => {
          if (shouldTrackLoading) {
            uiManager.remove3DLoadingItem(key);
          }
        });

        if (!isDataLoading) {
          void loadAllModels(allModels);
        }
      },
      {
        fireImmediately: true,
      },
    );

    return () => disposer();
  }, []);
};
