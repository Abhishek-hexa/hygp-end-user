import {
  IReactionDisposer,
  makeAutoObservable,
  reaction,
  runInAction,
} from 'mobx';

import { StateManager } from '../../StateManager';
import { Service3D } from '../services/Service3D';
import { CachedAssets } from '../../../loaders/CachedAssets';

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

const MAX_LINES = 4;
const LINE_GAP_RATIO = 0.002;
const DEFAULT_FONT_FAMILY = 'Arial';
const DEFAULT_FONT_WEIGHT = 'bold';

const HERO_HEIGHT_RATIOS: Record<number, number> = {
  1: 1.0,
  2: 0.75,
  3: 0.55,
  4: 0.35,
};

export const DEFAULT_ENGRAVING_CONFIG: EngravingConfig = {
  height: 11 * 40,
  lines: [],
  width: 14 * 40,
};

const cloneLines = (lines: EngravingConfigLine[]): EngravingConfigLine[] =>
  lines.map((line) => ({ ...line }));

export class Engraving3Dmanager {
  private _libstate: StateManager;
  private requestId = 0;
  private syncDisposer: IReactionDisposer;

  config: EngravingConfig;
  imageUrl: string | null = null;
  aspect: number;
  loading = false;
  error: string | null = null;

  constructor(
    inLibstate: StateManager,
    initialConfig: EngravingConfig = DEFAULT_ENGRAVING_CONFIG,
  ) {
    this._libstate = inLibstate;
    this.config = { ...initialConfig, lines: cloneLines(initialConfig.lines) };
    this.aspect = this.config.width / this.config.height;

    makeAutoObservable(this, {}, { autoBind: true });

    this.syncDisposer = reaction(
      () => this.getEngravingConfigLines(),
      (lines) => this.setConfig({ lines }),
      { fireImmediately: true },
    );
  }

  setConfig(partial: Partial<EngravingConfig>): void {
    this.config = {
      ...this.config,
      ...partial,
      lines: partial.lines
        ? cloneLines(partial.lines)
        : cloneLines(this.config.lines),
    };
    void this.refreshTexture();
  }

  async refreshTexture(): Promise<void> {
    const currentRequestId = ++this.requestId;
    this.loading = true;
    this.error = null;

    try {
      const result = await this.generateEngravingTexture(this.config);

      if (currentRequestId !== this.requestId) {
        URL.revokeObjectURL(result.imageUrl);
        return;
      }

      runInAction(() => {
        if (this.imageUrl) URL.revokeObjectURL(this.imageUrl);
        this.imageUrl = result.imageUrl;
        this.aspect = result.aspect;
        this.loading = false;
      });
    } catch (error) {
      if (currentRequestId !== this.requestId) return;

      runInAction(() => {
        this.loading = false;
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to generate engraving texture';
      });
    }
  }

  dispose(): void {
    this.requestId += 1;
    this.syncDisposer();

    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
    }
  }

  private async generateEngravingTexture(
    config: EngravingConfig,
  ): Promise<{ imageUrl: string; aspect: number }> {
    const {
      lines,
      width,
      height,
      fontFamily = DEFAULT_FONT_FAMILY,
      fontWeight = DEFAULT_FONT_WEIGHT,
    } = config;

    const renderLines = this.calculateRenderLines(lines);

    const fontUrls = renderLines
      .map((line) => line.fontUrl)
      .filter((url): url is string => !!url)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    if (fontUrls.length > 0) {
      const fontLoadResult = await CachedAssets.loadFonts(fontUrls);
      if (fontLoadResult.isError) {
        throw fontLoadResult.error ?? new Error('Failed to load one or more fonts');
      }
    }

    const canvas = Service3D.createCanvas(width, height);

    try {
      if (renderLines.length === 0) {
        return {
          aspect: width / height,
          imageUrl: await Service3D.canvasToBlobUrl(canvas),
        };
      }

      const paddingX = width * 0.01;
      const paddingY = height * 0.05;
      const usableWidth = width - paddingX * 2;
      const usableHeightMax = height - paddingY * 2;

      const lineCount = renderLines.length;
      const lineGap = LINE_GAP_RATIO * height;
      const totalGapHeight = lineGap * (lineCount - 1);
      const usableHeight = usableHeightMax - totalGapHeight;

      const heroRatio = HERO_HEIGHT_RATIOS[lineCount] ?? 0.4;
      const secondaryRatio =
        lineCount > 1 ? (1 - heroRatio) / (lineCount - 1) : 0;

      const heightBudgets = renderLines.map((_, i) =>
        i === 0 ? usableHeight * heroRatio : usableHeight * secondaryRatio,
      );

      const textObjects = renderLines.map((line, i) =>
        Service3D.createTextObjectForBudget(
          line.text,
          heightBudgets[i],
          usableWidth,
          line.fontUrl
            ? CachedAssets.getFontFamily(line.fontUrl)
            : fontFamily,
          line.fontWeight ?? fontWeight,
        ),
      );

      const totalRenderedHeight =
        textObjects.reduce((sum, t) => sum + t.getScaledHeight(), 0) +
        totalGapHeight;

      if (totalRenderedHeight > usableHeightMax) {
        const scale = usableHeightMax / totalRenderedHeight;
        textObjects.forEach((t) => {
          t.set({
            scaleX: (t.scaleX ?? 1) * scale,
            scaleY: (t.scaleY ?? 1) * scale,
          });
        });
        Service3D.positionTextObjects(
          textObjects,
          lineGap * scale,
          width,
          height,
        );
      } else {
        Service3D.positionTextObjects(textObjects, lineGap, width, height);
      }

      canvas.add(...textObjects);
      canvas.renderAll();

      const htmlCanvas = canvas.getElement();

      const trimmedCanvas = this.trimCanvas(htmlCanvas);

      const blob = await new Promise<Blob>((resolve) => {
        trimmedCanvas.toBlob((b) => resolve(b!), 'image/png');
      });

      const imageUrl = URL.createObjectURL(blob);

      return {
        aspect: trimmedCanvas.width / trimmedCanvas.height,
        imageUrl,
      };
    } finally {
      await canvas.dispose();
    }
  }

  private getEngravingConfigLines(): EngravingConfigLine[] {
    const { engravingManager } = this._libstate.designManager.productManager;
    const fonts = engravingManager.availableFonts;

    return engravingManager.lines
      .map((line) => ({
        fontFamily: line.font !== null ? fonts.get(line.font)?.name : undefined,
        fontUrl:
          line.font !== null ? fonts.get(line.font)?.font_path : undefined,
        text: line.text.trim(),
      })); 
  }

  private trimCanvas(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')!;
    const { width, height } = canvas;

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let top = null,
      bottom = null,
      left = null,
      right = null;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 0) {
          if (top === null) top = y;
          bottom = y;
          if (left === null || x < left) left = x;
          if (right === null || x > right) right = x;
        }
      }
    }

    if (top === null) return canvas;

    const trimmedWidth = right! - left! + 1;
    const trimmedHeight = bottom! - top! + 1;

    const trimmedCanvas = document.createElement('canvas');
    trimmedCanvas.width = trimmedWidth;
    trimmedCanvas.height = trimmedHeight;

    const trimmedCtx = trimmedCanvas.getContext('2d')!;
    trimmedCtx.putImageData(
      ctx.getImageData(left!, top!, trimmedWidth, trimmedHeight),
      0,
      0,
    );

    return trimmedCanvas;
  }

  private calculateRenderLines(lines: EngravingConfigLine[]) {
    let renderLines: EngravingConfigLine[] = [];

    lines.forEach((line) => {
      renderLines.push({
        text: line.text.length === 0 ? ' ' : line.text,
        fontFamily: line.fontFamily,
        fontWeight: line.fontWeight,
        fontUrl: line.fontUrl,
      });
    });

    return renderLines;
  }
}
