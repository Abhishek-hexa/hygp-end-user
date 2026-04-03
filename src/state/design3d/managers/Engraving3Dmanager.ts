import {
  makeAutoObservable,
  reaction,
  runInAction,
} from 'mobx';
import * as THREE from 'three';

import { StateManager } from '../../StateManager';
import { CachedAssets } from '../../../loaders/CachedAssets';
import {
  FabricCanvasService,
  EngravingRenderLine,
} from '../../../service/FabricCanvasService ';

// Types

export type EngravingConfigLine = {
  text: string;
  fontFamily?: string;
  fontWeight?: string;
  fontUrl?: string;
};

export type EngravingConfig = {
  lines: EngravingConfigLine[];
  width: number;
  height: number;
  fontFamily?: string;
  fontWeight?: string;
};

export type DecalTransform = {
  position: [number, number, number];
  scale: [number, number, number];
};

// Constants

const DEFAULT_FONT_FAMILY = 'Arial';
const DEFAULT_FONT_WEIGHT = 'bold';

export const DEFAULT_ENGRAVING_CONFIG: EngravingConfig = {
  height: 11 * 40,
  width: 14 * 40,
  lines: [],
};


// Manager

export class Engraving3Dmanager {
  private requestId = 0;

  config: EngravingConfig;
  imageUrl: string | null = null;
  aspect: number;
  loading = false;
  error: string | null = null;

  constructor(
    private readonly libstate: StateManager,
    initialConfig: EngravingConfig = DEFAULT_ENGRAVING_CONFIG,
  ) {
    this.config = { ...initialConfig, lines: this.cloneLines(initialConfig.lines) };
    this.aspect = this.config.width / this.config.height;

    makeAutoObservable(this, {}, { autoBind: true });

    reaction(
      () => this.selectEngravingLines(),
      (lines) => this.setConfig({ lines }),
      { fireImmediately: true },
    );
  }

  // Public API

  get planeMesh() {
    return this.libstate.design3DManager.meshManager.planeMesh;
  }

  get decalTransform(): DecalTransform | null {
    const mesh = this.planeMesh;
    if (!mesh) return null;

    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    if (!box) return null;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    return {
      position: [center.x, center.y, center.z + 0.001],
      scale: [size.x, size.y, size.z || 0.01],
    };
  }

  prepareDecalTexture(texture: THREE.Texture | null): THREE.Texture | null {
    if (!texture) return null;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }

  private setConfig(partial: Partial<EngravingConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      lines: this.cloneLines(partial.lines ?? this.config.lines),
    };
    void this.refreshTexture();
  }

  private async refreshTexture(): Promise<void> {
    const id = ++this.requestId;
    this.loading = true;
    this.error = null;

    try {
      const result = await this.buildTexture();

      if (id !== this.requestId) {
        URL.revokeObjectURL(result.imageUrl);
        return;
      }

      runInAction(() => {
        if (this.imageUrl) URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = result.imageUrl;
        this.aspect = result.aspect;
        this.loading = false;
      });
    } catch (err) {
      if (id !== this.requestId) return;
      runInAction(() => {
        this.loading = false;
        this.error =
          err instanceof Error
            ? err.message
            : 'Failed to generate engraving texture';
      });
    }
  }


  // Private

  private async buildTexture() {
    const {
      lines,
      width,
      height,
      fontFamily = DEFAULT_FONT_FAMILY,
      fontWeight = DEFAULT_FONT_WEIGHT,
    } = this.config;

    // Resolve fonts and build render lines in one pass
    const renderLines = await this.resolveRenderLines(
      lines,
      fontFamily,
      fontWeight,
    );

    const fabricService = new FabricCanvasService();
    return fabricService.generateEngravingTexture({
      lines: renderLines,
      width,
      height,
    });
  }

  /**
   * Loads any custom fonts, then maps config lines to resolved render lines
   * with concrete fontFamily names ready for Fabric.
   */
  private async resolveRenderLines(
    lines: EngravingConfigLine[],
    defaultFontFamily: string,
    defaultFontWeight: string,
  ): Promise<EngravingRenderLine[]> {
    const fontUrls = [
      ...new Set(lines.map((l) => l.fontUrl).filter(Boolean) as string[]),
    ];

    if (fontUrls.length > 0) {
      const result = await CachedAssets.loadFonts(fontUrls);
      if (result.isError)
        throw result.error ?? new Error('Failed to load fonts');
    }

    return lines.map((line) => ({
      // Empty lines render as a space so Fabric still allocates height
      text: line.text.trim() || ' ',
      fontFamily: line.fontUrl
        ? CachedAssets.getFontFamily(line.fontUrl)
        : (line.fontFamily ?? defaultFontFamily),
      fontWeight: line.fontWeight ?? defaultFontWeight,
    }));
  }

  private selectEngravingLines(): EngravingConfigLine[] {
    const { engravingManager } = this.libstate.designManager.productManager;
    const fonts = engravingManager.availableFonts;

    return engravingManager.lines.map((line) => ({
      text: line.text.trim(),
      fontFamily: line.font !== null ? fonts.get(line.font)?.name : undefined,
      fontUrl: line.font !== null ? fonts.get(line.font)?.font_path : undefined,
    }));
  }
  private cloneLines(lines: EngravingConfigLine[]): EngravingConfigLine[] {
    return lines.map((line) => ({ ...line }));
  }
}

