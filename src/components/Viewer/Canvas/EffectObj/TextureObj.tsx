import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';
import { loadHdrEnvMapCached } from './hdrEnvMapCache';

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataURL(
  url: string,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(url, { cache: 'no-cache', signal });
  if (!response.ok) throw new Error('Failed to fetch texture image');
  const blob = await response.blob();
  return blobToDataURL(blob);
}

interface GridSVGData {
  svgString: string;
  width: number;
  height: number;
  oWidth: number;
  oHeight: number;
  svgDoc: Document;
}

function create3x3GridPNG(
  imageUrl: string,
  originalWidth: number,
  originalHeight: number,
): GridSVGData {
  const parser = new DOMParser();
  const svg = `
      <svg width="${originalWidth * 3}" height="${originalHeight * 3}" xmlns="http://www.w3.org/2000/svg">
        ${[0, 1, 2]
          .map((row) =>
            [0, 1, 2]
              .map((col) => {
                const x = col * originalWidth;
                const y = row * originalHeight;
                return `<image href="${imageUrl}" x="${x}" y="${y}" width="${originalWidth}" height="${originalHeight}" />`;
              })
              .join(''),
          )
          .join('')}
      </svg>
    `;
  return {
    height: originalHeight * 3,
    oHeight: originalHeight,
    oWidth: originalWidth,
    svgDoc: parser.parseFromString(svg, 'image/svg+xml'),
    svgString: svg,
    width: originalWidth * 3,
  };
}

function offsetAndCropSVG(
  offsetX: number,
  offsetY: number,
  cropWidth: number,
  cropHeight: number,
  svgDoc: Document,
): string {
  const svgElement = svgDoc.documentElement;
  svgElement.setAttribute('width', String(cropWidth));
  svgElement.setAttribute('height', String(cropHeight));
  svgElement.setAttribute(
    'viewBox',
    `${offsetX} ${offsetY} ${cropWidth} ${cropHeight}`,
  );
  return svgElement.outerHTML;
}

function createNewSVG(
  gridSVGData: GridSVGData,
  unitCenterX: number,
  unitCenterY: number,
  unitCropHeight: number,
): { svg: string; width: number; height: number } {
  const unitCropWidth = 1;
  const originalWidth = gridSVGData.oWidth;
  const originalHeight = gridSVGData.oHeight;
  const cropWidth = unitCropWidth * originalWidth;
  const cropHeight = unitCropHeight * originalHeight;
  const offsetX =
    originalWidth * 1.5 - cropWidth / 2 + unitCenterX * (originalWidth / 2);
  const offsetY =
    originalHeight * 1.5 - cropHeight / 2 + unitCenterY * (originalHeight / 2);
  return {
    height: cropHeight,
    svg: offsetAndCropSVG(
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      gridSVGData.svgDoc,
    ),
    width: cropWidth,
  };
}

function svgToTexture(
  svgString: string,
  targetHeight: number,
): Promise<THREE.Texture> {
  return new Promise((resolve, reject) => {
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElem = svgDoc.documentElement;
    const originalWidth = parseFloat(svgElem.getAttribute('width') ?? '1') || 1;
    const originalHeight =
      parseFloat(svgElem.getAttribute('height') ?? '1') || 1;
    const aspectRatio = originalWidth / originalHeight;
    let targetWidth = targetHeight * aspectRatio;
    const MAX_TEXTURE_SIZE = 2048;
    if (targetWidth > MAX_TEXTURE_SIZE || targetHeight > MAX_TEXTURE_SIZE) {
      const scale = MAX_TEXTURE_SIZE / Math.max(targetWidth, targetHeight);
      targetWidth = Math.floor(targetWidth * scale);
      targetHeight = Math.floor(targetHeight * scale);
    }

    svgElem.setAttribute('width', `${targetWidth}px`);
    svgElem.setAttribute('height', `${targetHeight}px`);
    const updatedSvgString = new XMLSerializer().serializeToString(svgElem);
    const svgBlob = new Blob([updatedSvgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.width = targetWidth;
    img.height = targetHeight;
    img.onload = () => {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;
      URL.revokeObjectURL(url);
      resolve(texture);
    };
    img.onerror = (err) => {
      URL.revokeObjectURL(url);
      reject(err);
    };
    img.src = url;
  });
}

interface SizeEntry {
  size: string;
  translateX?: number;
  translateY?: number;
  scale?: number;
}

type TextureMeshInput = THREE.Mesh | THREE.BufferGeometry;

function getSizeEntries(parsed: unknown, productKey?: string): SizeEntry[] {
  if (Array.isArray(parsed)) {
    return parsed as SizeEntry[];
  }

  if (!parsed || typeof parsed !== 'object') {
    return [];
  }

  const source = parsed as Record<string, unknown>;
  const keyVariants = productKey
    ? [
        productKey,
        productKey.toLowerCase(),
        productKey.toUpperCase(),
        productKey.replaceAll('_', ''),
        productKey.toLowerCase().replaceAll('_', ''),
        productKey.toLowerCase().replaceAll('_', '-'),
        productKey.toLowerCase().replaceAll('_', ' '),
      ]
    : [];

  for (const key of keyVariants) {
    const candidate = source[key];
    if (Array.isArray(candidate)) {
      return candidate as SizeEntry[];
    }
  }

  if (Array.isArray(source.collar)) {
    return source.collar as SizeEntry[];
  }

  return [];
}

interface TextureObjProps {
  mesh: TextureMeshInput | TextureMeshInput[];
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

const TextureObj = ({
  mesh,
  texturePath,
  dataX,
  currentSize,
  productKey,
  envMap,
  onTextureReady,
  side = THREE.FrontSide,
  normalMapPath = '/assets/texture/texture/webbingNormal.jpg',
  normalRepeat = [5, 5],
}: TextureObjProps) => {
  const { uiManager } = useMainContext();
  const { gl } = useThree();
  const [webTexture, setWebTexture] = useState<THREE.Texture | null>(null);
  const [originalSvgForTexture, setOriginalSvgForTexture] =
    useState<GridSVGData | null>(null);
  const [localEnvMap, setLocalEnvMap] = useState<THREE.Texture | null>(null);
  const normalMap = useMyTexture(normalMapPath);
  const materialRef = useRef(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8e8e8'),
      metalness: 1,
      normalScale: new THREE.Vector2(30.5, -30.5),
      roughness: 0.8,
    }),
  );
  const webTextureRef = useRef<THREE.Texture | null>(null);
  const [normalRepeatX, normalRepeatY] = normalRepeat;

  const parsedSizes = useMemo(() => {
    if (!dataX) return [];
    try {
      return getSizeEntries(JSON.parse(dataX), productKey);
    } catch {
      return [];
    }
  }, [dataX, productKey]);

  useEffect(() => {
    return () => {
      materialRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    uiManager.add3DLoadingItem('/assets/texture/texture/white1.hdr');
    loadHdrEnvMapCached('/assets/texture/texture/white1.hdr')
      .then((texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        setLocalEnvMap(texture);
        uiManager.remove3DLoadingItem('/assets/texture/texture/white1.hdr');
      })
      .catch(() => {
        setLocalEnvMap(null);
      });
  }, []);

  useEffect(() => {
    webTextureRef.current = webTexture;
  }, [webTexture]);

  useEffect(() => {
    if (!normalMap) return;
    normalMap.flipY = false;
    normalMap.wrapS = THREE.RepeatWrapping;
    normalMap.wrapT = THREE.RepeatWrapping;
    normalMap.repeat.set(normalRepeatX, normalRepeatY);
    normalMap.needsUpdate = true;
  }, [normalMap, normalRepeatX, normalRepeatY]);

  useEffect(() => {
    const maxAnisotropy = gl.capabilities.getMaxAnisotropy();
    if (normalMap) {
      normalMap.anisotropy = maxAnisotropy;
      normalMap.needsUpdate = true;
    }
    if (webTexture) {
      webTexture.anisotropy = maxAnisotropy;
      webTexture.needsUpdate = true;
    }
  }, [gl, normalMap, webTexture]);

  useEffect(() => {
    const mat = materialRef.current;
    mat.normalMap = normalMap;
    mat.side = side;
    mat.map = webTexture;
    const finalEnvMap = localEnvMap || envMap;
    mat.envMap = finalEnvMap ?? null;
    mat.envMapIntensity = finalEnvMap ? 6.5 : 0;
    mat.needsUpdate = true;
  }, [normalMap, side, webTexture, localEnvMap, envMap]);

  useEffect(() => {
    if (!texturePath) {
      setOriginalSvgForTexture(null);
      setWebTexture((prev) => {
        prev?.dispose();
        return null;
      });
      onTextureReady?.(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const load = async () => {
      try {
        const dataUrl = await fetchImageAsDataURL(
          texturePath,
          controller.signal,
        );
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          if (!active) return;
          setOriginalSvgForTexture(
            create3x3GridPNG(dataUrl, img.width, img.height),
          );
        };
      } catch {
        if (!active) return;
        setOriginalSvgForTexture(null);
      }
    };

    void load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [texturePath, onTextureReady]);

  useEffect(() => {
    if (!originalSvgForTexture || !currentSize) return;

    const clampedEntry = parsedSizes.find(
      (item) => item.size === currentSize,
    ) || {
      scale: 1,
      size: currentSize,
      translateX: 0,
      translateY: 0,
    };
    if (clampedEntry.scale === undefined) clampedEntry.scale = 1;
    clampedEntry.scale = Math.min(Math.max(clampedEntry.scale, 0.01), 2);
    const newSvg = createNewSVG(
      originalSvgForTexture,
      clampedEntry.translateX ?? 0,
      clampedEntry.translateY ?? 0,
      clampedEntry.scale ?? 1,
    );

    let active = true;
    svgToTexture(newSvg.svg, 500)
      .then((texture) => {
        if (!active) {
          texture.dispose();
          return;
        }

        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspectRatio = newSvg.width / newSvg.height;
        texture.repeat.set(1 / aspectRatio, 1);
        texture.needsUpdate = true;

        setWebTexture((prev) => {
          if (prev && prev !== texture) prev.dispose();
          return texture;
        });
        onTextureReady?.(texture);
      })
      .catch(() => {
        if (!active) return;
        setWebTexture((prev) => {
          prev?.dispose();
          return null;
        });
        onTextureReady?.(null);
      });

    return () => {
      active = false;
    };
  }, [originalSvgForTexture, currentSize, parsedSizes, onTextureReady]);

  useEffect(() => {
    return () => {
      webTextureRef.current?.dispose();
      webTextureRef.current = null;
    };
  }, []);

  const meshInputs = Array.isArray(mesh) ? mesh : [mesh];

  return (
    <>
      {meshInputs.map((entry, i) => {
        if (entry instanceof THREE.Mesh) {
          return (
            <mesh
              key={`${entry.uuid}-${i}`}
              geometry={entry.geometry}
              material={materialRef.current}
              position={entry.position}
              rotation={entry.rotation}
              scale={entry.scale}
            />
          );
        }

        return <mesh key={i} geometry={entry} material={materialRef.current} />;
      })}
    </>
  );
};

export default TextureObj;
