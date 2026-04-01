import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { loadHdrEnvMapCached } from '../components/Viewer/Canvas/EffectObj/hdrEnvMapCache';
import { GridSVGData, TextureUtils } from '../utils/TextureUtils';
import { useMainContext } from './useMainContext';
import { useMyTexture } from './useMyTexture';

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
}: UseTextureObjectOptions) {
  const { uiManager } = useMainContext();
  const { gl } = useThree();

  const [webTexture, setWebTexture] = useState<THREE.Texture | null>(null);
  const [gridSVGData, setGridSVGData] = useState<GridSVGData | null>(null);
  const [localEnvMap, setLocalEnvMap] = useState<THREE.Texture | null>(null);

  const normalMap = useMyTexture(normalMapPath);
  const material = useRef(createDefaultMaterial());
  const webTextureRef = useRef<THREE.Texture | null>(null);
  const onTextureReadyRef = useRef(onTextureReady);
  const textureSeq = useRef(0);
  const svgSeq = useRef(0);

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
    uiManager.add3DLoadingItem(HDR_PATH);
    loadHdrEnvMapCached(HDR_PATH)
      .then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setLocalEnvMap(texture);
      })
      .catch(() => setLocalEnvMap(null))
      .finally(() => uiManager.remove3DLoadingItem(HDR_PATH));
  }, [uiManager]);

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
    if (!texturePath) {
      setGridSVGData(null);
      setWebTexture((prev) => {
        prev?.dispose();
        return null;
      });
      onTextureReadyRef.current?.(null);
      return;
    }

    const controller = new AbortController();
    let active = true;
    const loadId = `texture-image-${++textureSeq.current}`;
    uiManager.add3DLoadingItem(loadId);

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

        setGridSVGData(
          TextureUtils.create3x3GridSVG(dataUrl, img.width, img.height),
        );
      } catch {
        if (!active) return;
        setGridSVGData(null);
      } finally {
        uiManager.remove3DLoadingItem(loadId);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [texturePath, uiManager]);

  useEffect(() => {
    if (!gridSVGData || !currentSize) return;

    const entry = TextureUtils.resolveClampedSizeEntry(parsedSizes, currentSize);
    const cropped = TextureUtils.buildCroppedSVG(
      gridSVGData,
      entry.translateX ?? 0,
      entry.translateY ?? 0,
      entry.scale ?? 1,
    );

    let active = true;
    const loadId = `svg-texture-${++svgSeq.current}`;
    uiManager.add3DLoadingItem(loadId);

    TextureUtils.svgToTexture(cropped.svg, SVG_RASTER_HEIGHT)
      .then((texture) => {
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
      })
      .catch(() => {
        if (!active) return;
        setWebTexture((prev) => {
          prev?.dispose();
          return null;
        });
        onTextureReadyRef.current?.(null);
      })
      .finally(() => uiManager.remove3DLoadingItem(loadId));

    return () => {
      active = false;
    };
  }, [gridSVGData, currentSize, parsedSizes, uiManager]);

  return material.current;
}
