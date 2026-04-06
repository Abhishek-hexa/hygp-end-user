import { reaction } from 'mobx';
import { useEffect, useRef } from 'react';

import { CachedAssets } from '../../loaders/CachedAssets';
import { ProductType } from '../../state/product/types';
import { useMainContext } from '../useMainContext';

interface Defaults {
  modelUrl: string | null;
  hdrs: string[];
  font: string | null;
  textures: string[];
}

const DEFAULT_HDRS = [
  '/assets/texture/texture/white1.hdr',
  '/assets/texture/texture/metro_vijzelgracht_1k2.hdr',
];

const PRODUCT_DEFAULT_NORMALS: Record<ProductType, string[]> = {
  [ProductType.BANDANA]: ['/assets/texture/texture/webbingNormal.jpg'],
  [ProductType.CAT_COLLAR]: ['/assets/texture/texture/webbingNormal.jpg'],
  [ProductType.DOG_COLLAR]: ['/assets/texture/texture/webbingNormal.jpg'],
  [ProductType.HARNESS]: [
    '/assets/texture/texture/base1Normal.webp',
    '/assets/texture/texture/base2Normal.webp',
    '/assets/texture/texture/beltNormal.webp',
    '/assets/texture/texture/bottomNormal.webp',
  ],
  [ProductType.LEASH]: ['/assets/texture/texture/webbingNormal.jpg'],
  [ProductType.MARTINGALE]: ['/assets/texture/texture/webbingNormal.jpg'],
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

const hasUncachedBlockingDefaults = (defaults: Defaults) => {
  const modelPending = defaults.modelUrl
    ? (() => {
        const status = CachedAssets.getModelStatus(defaults.modelUrl);
        return !status.isLoaded;
      })()
    : false;

  const fontPending = defaults.font
    ? (() => {
        const status = CachedAssets.getFontStatus(defaults.font);
        return !status.isLoaded;
      })()
    : false;

  const hdrPending = defaults.hdrs.some((hdrUrl) => {
    const status = CachedAssets.getHdrStatus(hdrUrl);
    return !status.isLoaded;
  });

  const texturePending = defaults.textures.some((textureUrl) => {
    const status = CachedAssets.getTextureStatus(textureUrl);
    return !status.isLoaded;
  });

  return modelPending || fontPending || hdrPending || texturePending;
};

export const useDefaults = () => {
  const { designManager, uiManager } = useMainContext();
  const { productManager } = designManager;
  const defaultsRunIdRef = useRef(0);

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
      }),
      ({ key, modelPath, selectedTexture, selectedFont }) => {
        const defaultNormals = PRODUCT_DEFAULT_NORMALS[key] ?? [];
        const runId = ++defaultsRunIdRef.current;
        const loadingItemId = `defaults:${key}:${runId}`;

        const defaults: Defaults = {
          font: selectedFont,
          hdrs: DEFAULT_HDRS,
          modelUrl: modelPath,
          textures: [
            ...defaultNormals,
            ...(selectedTexture ? [selectedTexture] : []),
          ],
        };

        const blockingDefaults: Defaults = {
          font: selectedFont,
          hdrs: DEFAULT_HDRS,
          modelUrl: modelPath,
          textures: defaultNormals,
        };

        const shouldTrackLoading =
          hasUncachedBlockingDefaults(blockingDefaults);
        uiManager.setDefaultLoaded(false);

        if (shouldTrackLoading) {
          uiManager.add3DLoadingItem(loadingItemId);
        }

        initializeDefaults(defaults).finally(() => {
          if (shouldTrackLoading) {
            uiManager.remove3DLoadingItem(loadingItemId);
          }
          if (runId === defaultsRunIdRef.current) {
            uiManager.setDefaultLoaded(true);
          }
        });
      },
      {
        fireImmediately: true,
      },
    );

    return () => disposer();
  }, [productManager, uiManager]);
};
