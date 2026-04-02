import { useEffect, useState } from 'react';
import * as THREE from 'three';

import { CachedAssets } from '../loaders/CachedAssets';
import { useMainContext } from './useMainContext';

interface UseMyHdrOptions {
  trackLoading?: boolean;
}

export function useMyHdr(
  url: string | null | undefined,
  options: UseMyHdrOptions = {},
): THREE.Texture | null {
  const { trackLoading = true } = options;
  const [hdrTexture, setHdrTexture] = useState<THREE.Texture | null>(() => {
    if (url) return CachedAssets.getHdr(url);
    return null;
  });
  const { uiManager } = useMainContext();

  useEffect(() => {
    if (!url) {
      setHdrTexture(null);
      return;
    }

    const cached = CachedAssets.getHdr(url);
    if (cached) {
      setHdrTexture(cached);
      return;
    }

    let isMounted = true;
    const loadingId = `hdr:${url}`;
    const status = CachedAssets.getHdrStatus(url);
    const shouldTrackWithUi =
      trackLoading && !status.isLoaded && !status.isLoading;
    
    (async () => {
      try {
        if (shouldTrackWithUi) {
          uiManager.add3DLoadingItem(loadingId);
        }
        const result = await CachedAssets.loadHdr(url);
        if (isMounted && result.asset) setHdrTexture(result.asset);
      } catch (err) {
        console.error('Error loading HDR:', url, err);
      } finally {
        if (shouldTrackWithUi) {
          uiManager.remove3DLoadingItem(loadingId);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [trackLoading, url, uiManager]);

  return hdrTexture;
}
