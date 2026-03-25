import { useThree } from '@react-three/fiber';
import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useMyTexture } from '../../../../hooks/useMyTexture';
import { loadHdrEnvMapCached } from './hdrEnvMapCache';

async function createBlobUrlFromUrl(url: string): Promise<string> {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) throw new Error('Failed to fetch the file');
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

async function blobUrlToDataURL(blobUrl: string): Promise<string> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

interface GridSVGData {
    svgString: string;
    width: number;
    height: number;
    oWidth: number;
    oHeight: number;
    svgDoc: Document;
}

function create3x3GridPNG(imageUrl: string, originalWidth: number, originalHeight: number): GridSVGData {
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
        svgString: svg,
        width: originalWidth * 3,
        height: originalHeight * 3,
        oWidth: originalWidth,
        oHeight: originalHeight,
        svgDoc: parser.parseFromString(svg, 'image/svg+xml'),
    };
}

function offsetAndCropSVG(
    _svgString: string,
    offsetX: number,
    offsetY: number,
    cropWidth: number,
    cropHeight: number,
    svgDoc: Document,
): string {
    const svgElement = svgDoc.documentElement;
    svgElement.setAttribute('width', String(cropWidth));
    svgElement.setAttribute('height', String(cropHeight));
    svgElement.setAttribute('viewBox', `${offsetX} ${offsetY} ${cropWidth} ${cropHeight}`);
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
    const offsetX = originalWidth * 1.5 - cropWidth / 2 + unitCenterX * (originalWidth / 2);
    const offsetY = originalHeight * 1.5 - cropHeight / 2 + unitCenterY * (originalHeight / 2);
    return {
        svg: offsetAndCropSVG(gridSVGData.svgString, offsetX, offsetY, cropWidth, cropHeight, gridSVGData.svgDoc),
        width: cropWidth,
        height: cropHeight,
    };
}

function svgToTexture(svgString: string, targetHeight: number): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const svgElem = svgDoc.documentElement;
        const originalWidth = parseFloat(svgElem.getAttribute('width') ?? '1') || 1;
        const originalHeight = parseFloat(svgElem.getAttribute('height') ?? '1') || 1;
        const aspectRatio = originalWidth / originalHeight;
        let targetWidth = targetHeight * aspectRatio;
        const MAX_TEXTURE_SIZE = 2048;
        if (targetWidth > MAX_TEXTURE_SIZE || targetHeight > MAX_TEXTURE_SIZE) {
            const scale = MAX_TEXTURE_SIZE / Math.max(targetWidth, targetHeight);
            targetWidth *= scale;
            targetHeight *= scale;
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

function applyTexture(
    svg: GridSVGData,
    sizeData: SizeEntry,
    setTexture: (t: THREE.Texture | null) => void,
    repeatXValue = 1,
) {
    if (!svg) return;
    const newSVG = createNewSVG(svg, sizeData.translateX ?? 0, sizeData.translateY ?? 0, sizeData.scale ?? 1);
    svgToTexture(newSVG.svg, 500).then((texture) => {
        texture.flipY = false;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        const aspectRatio = newSVG.width / newSVG.height;
        texture.repeat.set(repeatXValue / aspectRatio, 1);
        texture.needsUpdate = true;
        setTexture(texture);
    });
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
    normalRepeat = [0.7, 0.7],
}: TextureObjProps) => {
    const { gl } = useThree();
    const [webTexture, setWebTexture] = useState<THREE.Texture | null>(null);
    const [originalSvgForTexture, setOriginalSvgForTexture] = useState<GridSVGData | null>(null);
    const [localEnvMap, setLocalEnvMap] = useState<THREE.Texture | null>(null);

    useEffect(() => {
        loadHdrEnvMapCached('/assets/texture/texture/white1.hdr').then((texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            setLocalEnvMap(texture);
        });
    }, []);

    const normalMap = useMyTexture(normalMapPath);
    if (normalMap) {
      normalMap.flipY = false;
      normalMap.wrapS = THREE.RepeatWrapping;
      normalMap.wrapT = THREE.RepeatWrapping;
      normalMap.repeat.set(normalRepeat[0], normalRepeat[1]);
    }

    if (webTexture) {
        webTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
        webTexture.needsUpdate = true;
    }
    if (normalMap) {
        normalMap.anisotropy = gl.capabilities.getMaxAnisotropy();
        normalMap.needsUpdate = true;
    }

    const material = useMemo(() => {
        const mat = new THREE.MeshPhysicalMaterial();
        mat.normalMap = normalMap;
        mat.side = side;
        mat.normalScale = new THREE.Vector2(30.5, -30.5);
        mat.color = new THREE.Color('#e8e8e8');
        const finalEnvMap = localEnvMap || envMap;
        if (finalEnvMap) {
            mat.envMap = finalEnvMap;
            mat.envMapIntensity = 6.5;
        }
        mat.map = webTexture;
        mat.roughness = 0.8;
        mat.metalness = 1;
        mat.needsUpdate = true;
        return mat;
    }, [webTexture, normalMap, localEnvMap, envMap, side]);

    useEffect(() => {
        if (!texturePath) {
            setWebTexture(null);
            onTextureReady?.(null);
            return;
        }
        let cancelled = false;
        const load = async () => {
            const pngBlobUrl = await createBlobUrlFromUrl(texturePath);
            const dataUrl = await blobUrlToDataURL(pngBlobUrl);
            URL.revokeObjectURL(pngBlobUrl);
            const img = new Image();
            img.src = dataUrl;
            img.onload = () => {
                if (cancelled) return;
                setOriginalSvgForTexture(create3x3GridPNG(dataUrl, img.width, img.height));
            };
        };
        load();
        return () => { cancelled = true; };
    }, [texturePath]);

    useEffect(() => {
        if (!originalSvgForTexture || !dataX || !currentSize) return;
        let parsed: unknown = null;
        try {
            parsed = JSON.parse(dataX);
        } catch {
            parsed = null;
        }
        const list = getSizeEntries(parsed, productKey);

        const sizeEntry = list.find((item) => item.size === currentSize) ?? {
            size: currentSize,
            translateX: 0,
            translateY: 0,
            scale: 1,
        };

        let scaleValue = sizeEntry.scale ?? 1;
        if (scaleValue === 1) {
            scaleValue = 1.005;
        } else if (scaleValue <= 0) {
            scaleValue = 0.01;
        } else if (scaleValue > 2) {
            scaleValue = 2;
        }

        const clampedEntry = {
            ...sizeEntry,
            scale: scaleValue,
        };

        applyTexture(originalSvgForTexture, clampedEntry, (tex) => {
            setWebTexture(tex);
            onTextureReady?.(tex);
        });
    }, [originalSvgForTexture, currentSize, dataX, productKey]);

    const meshInputs = Array.isArray(mesh) ? mesh : [mesh];

    return (
        <>
            {meshInputs.map((entry, i) => {
                if (entry instanceof THREE.Mesh) {
                    return (
                        <mesh
                            key={`${entry.uuid}-${i}`}
                            geometry={entry.geometry}
                            material={material}
                            position={entry.position}
                            rotation={entry.rotation}
                            scale={entry.scale}
                        />
                    );
                }

                return <mesh key={i} geometry={entry} material={material} />;
            })}
        </>
    );
};

export default TextureObj;
