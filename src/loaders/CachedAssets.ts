import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader';

// Loaders (module-level singletons — never allocated per-frame or per-call)
const _textureLoader = new THREE.TextureLoader();
const _hdrLoader = new HDRLoader();
const _gltfLoader = new GLTFLoader();

// Cache maps — one pair (result + in-flight promise) per asset type
const _textureCache = new Map<string, THREE.Texture>();
const _textureLoading = new Map<string, Promise<THREE.Texture>>();

const _hdrCache = new Map<string, THREE.Texture>();
const _hdrLoading = new Map<string, Promise<THREE.Texture>>();

const _gltfCache = new Map<string, GLTF>();
const _gltfLoading = new Map<string, Promise<GLTF>>();

const _fontCache = new Map<string, FontFace>();
const _fontLoading = new Map<string, Promise<FontFace>>();

const _textureErrors = new Map<string, unknown>();
const _hdrErrors = new Map<string, unknown>();
const _gltfErrors = new Map<string, unknown>();
const _fontErrors = new Map<string, unknown>();

export type AssetStatus = {
  isLoading: boolean;
  isLoaded: boolean;
  isError: boolean;
};

export type AssetLoadResult<T> = AssetStatus & {
  asset: T | null;
  error: unknown | null;
};

export class CachedAssets {
  // Prevent instantiation
  private constructor() {}

  // Texture

  /** Synchronously returns a cached texture, or null if not yet loaded. */
  static getTexture(url: string): THREE.Texture | null {
    return _textureCache.get(url) ?? null;
  }

  static getTextureStatus(url: string): AssetStatus {
    return {
      isError: _textureErrors.has(url),
      isLoaded: _textureCache.has(url),
      isLoading: _textureLoading.has(url),
    };
  }

  /**
   * Loads and caches a texture.
   * Concurrent calls for the same URL share a single in-flight promise.
   */
  static async loadTexture(
    url: string,
  ): Promise<AssetLoadResult<THREE.Texture>> {
    if (!this.isCacheableAssetUrl(url)) {
      try {
        const texture = await _textureLoader.loadAsync(url);
        return {
          asset: texture,
          error: null,
          isError: false,
          isLoaded: true,
          isLoading: false,
        };
      } catch (error) {
        return {
          asset: null,
          error,
          isError: true,
          isLoaded: false,
          isLoading: false,
        };
      }
    }

    const cached = _textureCache.get(url);
    if (cached) {
      return {
        asset: cached,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    }

    const inflight = _textureLoading.get(url);
    if (inflight) {
      try {
        const texture = await inflight;
        return {
          asset: texture,
          error: null,
          isError: false,
          isLoaded: true,
          isLoading: false,
        };
      } catch (error) {
        return {
          asset: null,
          error,
          isError: true,
          isLoaded: false,
          isLoading: false,
        };
      }
    }

    _textureErrors.delete(url);
    const promise = _textureLoader
      .loadAsync(url)
      .then((tex) => {
        _textureCache.set(url, tex);
        _textureErrors.delete(url);
        return tex;
      })
      .catch((error) => {
        _textureErrors.set(url, error);
        throw error;
      })
      .finally(() => {
        _textureLoading.delete(url);
      });

    _textureLoading.set(url, promise);

    try {
      const texture = await promise;
      return {
        asset: texture,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    } catch (error) {
      return {
        asset: null,
        error,
        isError: true,
        isLoaded: false,
        isLoading: false,
      };
    }
  }

  // HDR environment map

  /** Synchronously returns a cached HDR env-map texture, or null. */
  static getHdr(url: string): THREE.Texture | null {
    return _hdrCache.get(url) ?? null;
  }

  static getHdrStatus(url: string): AssetStatus {
    return {
      isError: _hdrErrors.has(url),
      isLoaded: _hdrCache.has(url),
      isLoading: _hdrLoading.has(url),
    };
  }

  /**
   * Loads and caches an HDR env-map via RGBELoader.
   * The mapping is set to EquirectangularReflectionMapping automatically.
   */
  static async loadHdr(url: string): Promise<AssetLoadResult<THREE.Texture>> {
    const cached = _hdrCache.get(url);
    if (cached) {
      return {
        asset: cached,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    }

    const inflight = _hdrLoading.get(url);
    if (inflight) {
      try {
        const texture = await inflight;
        return {
          asset: texture,
          error: null,
          isError: false,
          isLoaded: true,
          isLoading: false,
        };
      } catch (error) {
        return {
          asset: null,
          error,
          isError: true,
          isLoaded: false,
          isLoading: false,
        };
      }
    }

    _hdrErrors.delete(url);
    const promise = _hdrLoader
      .loadAsync(url)
      .then((tex) => {
        tex.mapping = THREE.EquirectangularReflectionMapping;
        _hdrCache.set(url, tex);
        return tex;
      })
      .catch((error) => {
        _hdrErrors.set(url, error);
        throw error;
      })
      .finally(() => {
        _hdrLoading.delete(url);
      });

    _hdrLoading.set(url, promise);

    try {
      const texture = await promise;
      return {
        asset: texture,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    } catch (error) {
      return {
        asset: null,
        error,
        isError: true,
        isLoaded: false,
        isLoading: false,
      };
    }
  }

  // GLTF / GLB model

  /** Synchronously returns a cached GLTF result, or null. */
  static getModel(url: string): GLTF | null {
    return _gltfCache.get(url) ?? null;
  }

  static getModelStatus(url: string): AssetStatus {
    return {
      isError: _gltfErrors.has(url),
      isLoaded: _gltfCache.has(url),
      isLoading: _gltfLoading.has(url),
    };
  }

  /**
   * Loads and caches a GLTF/GLB model via GLTFLoader.
   * Concurrent calls for the same URL share a single in-flight promise.
   */
  static async loadModel(url: string): Promise<AssetLoadResult<GLTF>> {
    const cached = _gltfCache.get(url);
    if (cached) {
      return {
        asset: cached,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    }

    const inflight = _gltfLoading.get(url);
    if (inflight) {
      try {
        const model = await inflight;
        return {
          asset: model,
          error: null,
          isError: false,
          isLoaded: true,
          isLoading: false,
        };
      } catch (error) {
        return {
          asset: null,
          error,
          isError: true,
          isLoaded: false,
          isLoading: false,
        };
      }
    }

    _gltfErrors.delete(url);
    const promise = _gltfLoader
      .loadAsync(url)
      .then((gltf) => {
        _gltfCache.set(url, gltf);
        return gltf;
      })
      .catch((error) => {
        _gltfErrors.set(url, error);
        throw error;
      })
      .finally(() => {
        _gltfLoading.delete(url);
      });

    _gltfLoading.set(url, promise);

    try {
      const model = await promise;
      return {
        asset: model,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    } catch (error) {
      return {
        asset: null,
        error,
        isError: true,
        isLoaded: false,
        isLoading: false,
      };
    }
  }

  // Font (CSS FontFace — for fabric.js / Canvas2D engraving text)

  /**
   * Returns the CSS font-family name that should be used in Canvas2D / fabric
   * once the font is loaded, whether or not it is actually loaded yet.
   */
  static getFontFamily(url: string): string {
    return this.fontFamilyName(url);
  }

  /** Returns true if the font has already been loaded and registered. */
  static isFontLoaded(url: string): boolean {
    return _fontCache.has(url);
  }

  static getFontStatus(url: string): AssetStatus {
    return {
      isError: _fontErrors.has(url),
      isLoaded: _fontCache.has(url),
      isLoading: _fontLoading.has(url),
    };
  }

  /**
   * Loads a font via FontFace API and registers it with `document.fonts`.
   * Concurrent calls for the same URL share a single in-flight promise.
   */
  static async loadFont(url: string): Promise<AssetLoadResult<FontFace>> {
    const cached = _fontCache.get(url);
    if (cached) {
      return {
        asset: cached,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    }

    const inflight = _fontLoading.get(url);
    if (inflight) {
      try {
        const font = await inflight;
        return {
          asset: font,
          error: null,
          isError: false,
          isLoaded: true,
          isLoading: false,
        };
      } catch (error) {
        return {
          asset: null,
          error,
          isError: true,
          isLoaded: false,
          isLoading: false,
        };
      }
    }

    _fontErrors.delete(url);
    const promise = (async () => {
      const fontFace = new FontFace(this.fontFamilyName(url), `url(${url})`);
      await fontFace.load();
      document.fonts.add(fontFace);
      _fontCache.set(url, fontFace);
      return fontFace;
    })()
      .catch((error) => {
        _fontErrors.set(url, error);
        throw error;
      })
      .finally(() => {
        _fontLoading.delete(url);
      });

    _fontLoading.set(url, promise);

    try {
      const font = await promise;
      return {
        asset: font,
        error: null,
        isError: false,
        isLoaded: true,
        isLoading: false,
      };
    } catch (error) {
      return {
        asset: null,
        error,
        isError: true,
        isLoaded: false,
        isLoading: false,
      };
    }
  }

  /**
   * Preloads multiple fonts in parallel. Errors per-font are isolated
   * so one failure does not cancel the rest.
   */
  static async loadFonts(urls: string[]): Promise<AssetLoadResult<null>> {
    const results = await Promise.all(
      urls
        .filter((url) => !_fontCache.has(url))
        .map((url) => CachedAssets.loadFont(url)),
    );

    const hasError = results.some((result) => result.isError);
    return {
      asset: null,
      error: hasError
        ? (results.find((result) => result.isError)?.error ?? null)
        : null,
      isError: hasError,
      isLoaded: !hasError,
      isLoading: false,
    };
  }

  // Helpers
  private static urlToFontFamilySlug(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private static fontFamilyName(url: string): string {
    return `engraving-font-${this.urlToFontFamilySlug(url)}`;
  }

  private static isCacheableAssetUrl(url: string): boolean {
    return !(url.startsWith('blob:') || url.startsWith('data:'));
  }
}
