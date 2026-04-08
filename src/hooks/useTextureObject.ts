import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { GridSVGData, TextureUtils } from '../utils/TextureUtils';
import { ProductType } from '../state/product/types';
import { useMyHdr } from './useMyHdr';
import { useMyTexture } from './useMyTexture';
import { useMainContext } from './useMainContext';

const DEFAULT_NORMAL_MAP_PATH = '/assets/texture/texture/webbingNormal.webp';
const HDR_PATH = '/assets/texture/texture/white1.hdr';
const DEFAULT_SVG_RASTER_HEIGHT = 500;

function createDefaultMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#e8e8e8'),
    metalness: 1,
    normalScale: new THREE.Vector2(30.5, -30.5),
    roughness: 0.8,
  });
}

export interface UseTextureObjectOptions {
  texturePath: string | null | undefined;
  dataX: string | null | undefined;
  currentSize: string | null | undefined;
  productKey?: string;
  envMap?: THREE.Texture | null;
  onTextureReady?: (tex: THREE.Texture | null) => void;
  side?: THREE.Side;
  normalMapPath?: string;
  normalRepeat?: [number, number];
  heightRepeat?: number;
  rasterHeight?: number;
  useLegacyBandanaTransform?: boolean;
  useLegacyHarnessTransform?: boolean;
}

export function useTextureObject({
  texturePath,
  dataX,
  currentSize,
  productKey,
  envMap,
  onTextureReady,
  side = THREE.FrontSide,
  normalMapPath = DEFAULT_NORMAL_MAP_PATH,
  normalRepeat = [5, 5],
  heightRepeat = 1,
  rasterHeight = DEFAULT_SVG_RASTER_HEIGHT,
  useLegacyBandanaTransform = false,
  useLegacyHarnessTransform = false,
}: UseTextureObjectOptions) {
  const { gl } = useThree();
  const { uiManager } = useMainContext();
  console.log(dataX)

  const [webTexture, setWebTexture] = useState<THREE.Texture | null>(null);
  const localEnvMap = useMyHdr(HDR_PATH, { trackLoading: false });

  const normalMap = useMyTexture(normalMapPath, { trackLoading: false });
  const material = useRef(createDefaultMaterial());
  const webTextureRef = useRef<THREE.Texture | null>(null);
  const onTextureReadyRef = useRef(onTextureReady);
  const bootLoader = useRef(0);

  const [normalRepeatX, normalRepeatY] = normalRepeat;

  useEffect(() => {
    onTextureReadyRef.current = onTextureReady;
  }, [onTextureReady]);

  useEffect(() => {
    webTextureRef.current = webTexture;
  }, [webTexture]);

  const parsedSizes = useMemo(() => {
    const isCollar =
      productKey === ProductType.DOG_COLLAR ||
      productKey === ProductType.CAT_COLLAR;
    if (isCollar) {
      return TextureUtils.parseCollarSizeEntries(dataX);
    }
    return TextureUtils.parseSizeEntries(dataX, productKey);
  }, [dataX, productKey]);
  const parsedBandanaSizes = useMemo(() => {
    if (!useLegacyBandanaTransform) return [];
    return TextureUtils.parseBandanaSizeEntries(dataX);
  }, [dataX, useLegacyBandanaTransform]);
  const parsedHarnessSizes = useMemo(() => {
    if (!useLegacyHarnessTransform) return [];
    return TextureUtils.parseHarnessSizeEntries(dataX);
  }, [dataX, useLegacyHarnessTransform]);
  const useLegacyUvTransform =
    useLegacyBandanaTransform || useLegacyHarnessTransform;

  useEffect(() => {
    return () => {
      material.current.dispose();
    };
  }, []);

  useEffect(() => {
    return () => {
      webTextureRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!normalMap) return;
    normalMap.flipY = false;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(normalRepeatX, normalRepeatY);
    normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
    normalMap.needsUpdate = true;
  }, [normalMap, normalRepeatX, normalRepeatY, gl]);

  useEffect(() => {
    if (!webTexture) return;
    webTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
    webTexture.needsUpdate = true;
  }, [gl, webTexture]);

  useEffect(() => {
    const mat = material.current;
    const finalEnvMap = envMap ?? localEnvMap ?? null;
    mat.normalMap = normalMap ?? null;
    mat.side = side;
    mat.map = webTexture;
    mat.envMap = finalEnvMap;
    mat.envMapIntensity = 6.5;
    mat.needsUpdate = true;
  }, [normalMap, side, webTexture, envMap, localEnvMap]);

  useEffect(() => {
    if (!texturePath || !currentSize) {
      setWebTexture((prev) => {
        prev?.dispose();
        return null;
      });
      onTextureReadyRef.current?.(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    (async () => {
      uiManager.add3DLoadingItem(`bootLoader${bootLoader.current}`);
      try {
        const dataUrl = await TextureUtils.fetchImageAsDataURL(
          texturePath,
          controller.signal,
        );
        const img = await TextureUtils.loadImageFromUrl(
          dataUrl,
          controller.signal,
        );
        if (!active) return;

        const gridSVGData: GridSVGData = TextureUtils.create3x3GridSVG(
          dataUrl,
          img.width,
          img.height,
        );

        const entry = useLegacyBandanaTransform
          ? TextureUtils.resolveLegacyBandanaEntry(
              parsedBandanaSizes,
              currentSize,
            )
          : useLegacyHarnessTransform
            ? TextureUtils.resolveLegacyHarnessEntry(
                parsedHarnessSizes,
                currentSize,
              )
          : TextureUtils.resolveClampedSizeEntry(parsedSizes, currentSize);
        let textureScale = entry.scale ?? 1;
        if (!useLegacyUvTransform && textureScale === 1) {
          textureScale = 1.005;
        } else if (textureScale <= 0) {
          textureScale = 0.01;
        } else if (textureScale > 2) {
          textureScale = 2;
        }
        const cropped = useLegacyUvTransform
          ? null
          : TextureUtils.buildCroppedSVG(
              gridSVGData,
              entry.translateX ?? 0,
              entry.translateY ?? 0,
              textureScale,
              heightRepeat,
            );

        const texture = useLegacyUvTransform
          ? await TextureUtils.svgToTextureViaLoader(gridSVGData.svgString)
          : await TextureUtils.svgToTexture(
              cropped?.svg ?? gridSVGData.svgString,
              rasterHeight,
              Math.min(gl.capabilities.maxTextureSize, 4096),
            );
        if (!active) {
          texture.dispose();
          return;
        }

        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        if (useLegacyUvTransform) {
          const baseAspect = gridSVGData.width / gridSVGData.height;
          const repeatX = 1 / baseAspect;
          const finalScale = textureScale * 3;
          texture.repeat.set((repeatX / 3) * finalScale, (1 / 3) * finalScale);
          const bufferValue = 1 - finalScale;
          texture.offset.x = (entry.translateX ?? 0) / 6;
          texture.offset.y = ((entry.translateY ?? 0) + bufferValue) / 6;
        } else {
          texture.repeat.set(1 / (cropped!.width / cropped!.height), 1);
        }
        texture.needsUpdate = true;

        setWebTexture((prev) => {
          if (prev !== texture) prev?.dispose();
          return texture;
        });
        onTextureReadyRef.current?.(texture);
      } catch {
        if (!active) return;
        setWebTexture((prev) => {
          prev?.dispose();
          return null;
        });
        onTextureReadyRef.current?.(null);
      } finally {
        uiManager.remove3DLoadingItem(`bootLoader${bootLoader.current}`);
        bootLoader.current++;
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [
    currentSize,
    parsedSizes,
    parsedBandanaSizes,
    parsedHarnessSizes,
    texturePath,
    heightRepeat,
    rasterHeight,
    useLegacyBandanaTransform,
    useLegacyHarnessTransform,
  ]);

  return material.current;
}
