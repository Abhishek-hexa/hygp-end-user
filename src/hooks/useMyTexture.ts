import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { useMainContext } from './useMainContext';

const textureCache = new Map<string, THREE.Texture>();
const loadingPromises = new Map<string, Promise<THREE.Texture>>();

export function useMyTexture(url: string | null | undefined): THREE.Texture | null {
  const [texture, setTexture] = useState<THREE.Texture | null>(() => {
    if (url && textureCache.has(url)) return textureCache.get(url)!;
    return null;
  });
  const { uiManager } = useMainContext();

  useEffect(() => {
    if (!url) {
      setTexture(null);
      return;
    }

    if (textureCache.has(url)) {
      setTexture(textureCache.get(url)!);
      return;
    }

    let isMounted = true;

    const fetchTexture = async () => {
      if (!loadingPromises.has(url)) {
        uiManager.add3DLoadingItem(`texture-${url}`);
        const loader = new THREE.TextureLoader();
        const promise = loader.loadAsync(url).then((loaded) => {
          textureCache.set(url, loaded);
          return loaded;
        }).catch(err => {
          console.error('Error loading texture:', url, err);
          throw err;
        }).finally(() => {
          uiManager.remove3DLoadingItem(`texture-${url}`);
          loadingPromises.delete(url);
        });
        loadingPromises.set(url, promise);
      }

      try {
        const loaded = await loadingPromises.get(url);
        if (isMounted && loaded) {
          setTexture(loaded);
        }
      } catch (err) {
        // Error is logged above
      }
    };

    fetchTexture();

    return () => {
      isMounted = false;
    };
  }, [url, uiManager]);

  return texture;
}
