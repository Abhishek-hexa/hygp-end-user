import * as THREE from 'three';
import { CachedAssets } from '../loaders/CachedAssets';
export interface SizeEntry {
  size: string;
  translateX?: number;
  translateY?: number;
  scale?: number;
}
const MAX_TEXTURE_SIZE = 2048;

export interface GridSVGData {
  svgString: string;
  width: number;
  height: number;
  oWidth: number;
  oHeight: number;
  svgDoc: Document;
}
export class TextureUtils {
  public static blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  public static async fetchImageAsDataURL(
    url: string,
    signal?: AbortSignal,
  ): Promise<string> {
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const texture =
      CachedAssets.getTexture(url) ?? (await CachedAssets.loadTexture(url)).asset;

    if (!texture) throw new Error('Failed to fetch texture image');
    if (signal?.aborted) {
      throw new DOMException('The operation was aborted.', 'AbortError');
    }

    const source = texture.image as
      | HTMLImageElement
      | HTMLCanvasElement
      | ImageBitmap
      | OffscreenCanvas
      | undefined;

    if (source instanceof HTMLImageElement) {
      return this.imageElementToDataURL(source);
    }
    if (source instanceof HTMLCanvasElement) {
      return source.toDataURL();
    }
    if (typeof ImageBitmap !== 'undefined' && source instanceof ImageBitmap) {
      const canvas = document.createElement('canvas');
      canvas.width = source.width;
      canvas.height = source.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      ctx.drawImage(source, 0, 0);
      return canvas.toDataURL();
    }
    if (
      typeof OffscreenCanvas !== 'undefined' &&
      source instanceof OffscreenCanvas
    ) {
      const blob = await source.convertToBlob();
      return this.blobToDataURL(blob);
    }

    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error('Failed to fetch texture image');
    return this.blobToDataURL(await response.blob());
  }

  private static imageElementToDataURL(image: HTMLImageElement): string {
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) throw new Error('Invalid texture image dimensions');

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');
    ctx.drawImage(image, 0, 0, width, height);
    return canvas.toDataURL();
  }

  public static loadImageFromUrl(
    src: string,
    signal?: AbortSignal,
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();

      const cleanup = () => {
        img.onload = null;
        img.onerror = null;
        signal?.removeEventListener('abort', onAbort);
      };

      const onAbort = () => {
        cleanup();
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      };

      img.onload = () => {
        cleanup();
        resolve(img);
      };
      img.onerror = (err) => {
        cleanup();
        reject(err);
      };

      if (signal?.aborted) {
        onAbort();
        return;
      }
      signal?.addEventListener('abort', onAbort);
      img.src = src;
    });
  }

  public static create3x3GridSVG(
    imageUrl: string,
    originalWidth: number,
    originalHeight: number,
  ): GridSVGData {
    const parser = new DOMParser();
    const tiles = [0, 1, 2]
      .flatMap((row) =>
        [0, 1, 2].map(
          (col) =>
            `<image href="${imageUrl}" x="${col * originalWidth}" y="${row * originalHeight}" width="${originalWidth}" height="${originalHeight}" />`,
        ),
      )
      .join('');

    const svgString = `<svg width="${originalWidth * 3}" height="${originalHeight * 3}" xmlns="http://www.w3.org/2000/svg">${tiles}</svg>`;

    return {
      svgString,
      svgDoc: parser.parseFromString(svgString, 'image/svg+xml'),
      width: originalWidth * 3,
      height: originalHeight * 3,
      oWidth: originalWidth,
      oHeight: originalHeight,
    };
  }

  public static buildCroppedSVG(
    grid: GridSVGData,
    unitCenterX: number,
    unitCenterY: number,
    unitCropHeight: number,
    heightRepeat: number
  ): { svg: string; width: number; height: number } {
    const { oWidth, oHeight, svgDoc } = grid;
    const cropWidth = oWidth;
    const cropHeight = unitCropHeight * oHeight * heightRepeat;
    const offsetX = oWidth * 1.5 - cropWidth / 2 + unitCenterX * (oWidth / 2);
    const offsetY =
      oHeight * 1.5 - cropHeight / 2 + unitCenterY * (oHeight / 2);

    const el = svgDoc.documentElement;
    el.setAttribute('width', String(cropWidth));
    el.setAttribute('height', String(cropHeight));
    el.setAttribute(
      'viewBox',
      `${offsetX} ${offsetY} ${cropWidth} ${cropHeight}`,
    );

    return { svg: el.outerHTML, width: cropWidth, height: cropHeight };
  }

  public static svgToTexture(
    svgString: string,
    targetHeight: number,
  ): Promise<THREE.Texture> {
    return new Promise((resolve, reject) => {
      const parser = new DOMParser();
      const svgElem = parser.parseFromString(
        svgString,
        'image/svg+xml',
      ).documentElement;

      const originalWidth =
        parseFloat(svgElem.getAttribute('width') ?? '1') || 1;
      const originalHeight =
        parseFloat(svgElem.getAttribute('height') ?? '1') || 1;
      const aspect = originalWidth / originalHeight;

      let tw = targetHeight * aspect;
      let th = targetHeight;

      if (tw > MAX_TEXTURE_SIZE || th > MAX_TEXTURE_SIZE) {
        const scale = MAX_TEXTURE_SIZE / Math.max(tw, th);
        tw = Math.floor(tw * scale);
        th = Math.floor(th * scale);
      }

      svgElem.setAttribute('width', `${tw}px`);
      svgElem.setAttribute('height', `${th}px`);

      const url = URL.createObjectURL(
        new Blob([new XMLSerializer().serializeToString(svgElem)], {
          type: 'image/svg+xml',
        }),
      );
      const img = new Image();

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

  public static parseSizeEntries(
    dataX: string | null | undefined,
    productKey?: string,
  ): SizeEntry[] {
    if (!dataX) return [];
    try {
      const parsed = JSON.parse(dataX);

      if (Array.isArray(parsed)) return parsed as SizeEntry[];

      if (parsed && typeof parsed === 'object') {
        const source = parsed as Record<string, unknown>;
        const keysToTry = productKey
          ? [
              productKey,
              productKey.toLowerCase(),
              productKey.toUpperCase(),
              productKey.replaceAll('_', ''),
              productKey.toLowerCase().replaceAll('_', ''),
              productKey.toLowerCase().replaceAll('_', '-'),
              productKey.toLowerCase().replaceAll('_', ' '),
              'collar', // fallback
            ]
          : ['collar'];

        for (const key of keysToTry) {
          if (Array.isArray(source[key])) return source[key] as SizeEntry[];
        }
      }
    } catch {
      // invalid JSON — return empty
    }
    return [];
  }

  public static resolveClampedSizeEntry(
    entries: SizeEntry[],
    currentSize: string,
  ): SizeEntry {
    const found = entries.find((e) => e.size === currentSize) ?? {
      size: currentSize,
      translateX: 0,
      translateY: 0,
      scale: 1,
    };

    return {
      ...found,
      scale: Math.min(Math.max(found.scale ?? 1, 0.01), 2),
    };
  }
}
