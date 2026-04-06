import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { GridSVGData, TextureUtils } from '../utils/TextureUtils';
import { useMyHdr } from './useMyHdr';
import { useMyTexture } from './useMyTexture';
import { useMainContext } from './useMainContext';

const DEFAULT_NORMAL_MAP_PATH = '/assets/texture/texture/webbingNormal.jpg';
const HDR_PATH = '/assets/texture/texture/white1.hdr';
const SVG_RASTER_HEIGHT = 500;

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
  heightRepeat?: number
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
  heightRepeat = 1
}: UseTextureObjectOptions) {
  const { gl } = useThree();
  const { uiManager } = useMainContext();

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

  const parsedSizes = useMemo(
    () => TextureUtils.parseSizeEntries(dataX, productKey),
    [dataX, productKey],
  );

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
    const finalEnvMap = localEnvMap ?? envMap ?? null;
    mat.normalMap = normalMap ?? null;
    mat.side = side;
    mat.map = webTexture;
    mat.envMap = finalEnvMap;
    mat.envMapIntensity = finalEnvMap ? 6.5 : 0;
    mat.needsUpdate = true;
  }, [normalMap, side, webTexture, localEnvMap, envMap]);

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
    if (bootLoader.current === 0) {
      uiManager.add3DLoadingItem(`bootLoader${bootLoader.current}`);
    }
    (async () => {
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

        const entry = TextureUtils.resolveClampedSizeEntry(
          parsedSizes,
          currentSize,
        );
        const cropped = TextureUtils.buildCroppedSVG(
          gridSVGData,
          entry.translateX ?? 0,
          entry.translateY ?? 0,
          entry.scale ?? 1,
          heightRepeat
        );

        const texture = await TextureUtils.svgToTexture(
          cropped.svg,
          SVG_RASTER_HEIGHT,
        );
        if (!active) {
          texture.dispose();
          return;
        }

        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.repeat.set(1 / (cropped.width / cropped.height), 1);
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
        if (bootLoader) {
          uiManager.remove3DLoadingItem(`bootLoader${bootLoader.current}`);
          bootLoader.current++;
        }
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [currentSize, parsedSizes, texturePath, heightRepeat]);

  return material.current;
}
