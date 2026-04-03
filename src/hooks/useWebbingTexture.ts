import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';

import { CachedAssets } from '../loaders/CachedAssets';
import { TextSize } from '../state/product/types';
import { FabricCanvasService } from '../service/FabricCanvasService ';
import { useMyHdr } from './useMyHdr';
import { useMyTexture } from './useMyTexture';

export interface WebbingTextureOptions {
  mesh: THREE.Mesh | undefined;
  text: string;
  fontUrl?: string;
  fontFamilyFallback: string;
  color: string;
  fontSize: TextSize;
}

export interface UseWebbingTextureResult {
  texture: THREE.Texture | null;
  envMap: THREE.Texture | null;
}

export function useWebbingTexture({
  mesh,
  text,
  fontUrl,
  fontFamilyFallback,
  color,
  fontSize,
}: WebbingTextureOptions): UseWebbingTextureResult {
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const fabricCanvasService = useMemo(() => new FabricCanvasService(), []);
  const texture = useMyTexture(textureUrl, { trackLoading: false });
  const localEnvMap = useMyHdr('/assets/texture/texture/white1.hdr');

  const sourceMaterial =
    mesh?.material instanceof THREE.MeshStandardMaterial ||
    mesh?.material instanceof THREE.MeshPhysicalMaterial
      ? mesh.material
      : null;

  const envMap = localEnvMap || sourceMaterial?.envMap || null;

  useEffect(() => {
    if (!mesh || !text.trim()) {
      setTextureUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
      return;
    }

    let cancelled = false;

    const generate = async () => {
      // Resolve font — falls back gracefully on load failure
      let fontFamily = fontFamilyFallback;
      if (fontUrl) {
        const result = await CachedAssets.loadFont(fontUrl);
        if (!result.isError) fontFamily = CachedAssets.getFontFamily(fontUrl);
      }

      if (cancelled) return;

      try {
        const url = await fabricCanvasService.generateWebbingTexture({
          mesh,
          text,
          fontFamily,
          color,
          fontSize,
        });

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        setTextureUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });
      } catch {
        // Texture generation failed — mesh renders without text overlay
      }
    };

    generate();
    return () => { cancelled = true; };
  }, [mesh, text, fontUrl, fontFamilyFallback, color, fontSize, fabricCanvasService]);

  useEffect(() => {
    return () => { if (textureUrl) URL.revokeObjectURL(textureUrl); };
  }, [textureUrl]);

  useEffect(() => {
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    texture.flipY = false;
    return () => texture.dispose();
  }, [texture]);

  return { texture, envMap };
}
