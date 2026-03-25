import { FabricText, StaticCanvas } from 'fabric';
import {
  IReactionDisposer,
  makeAutoObservable,
  reaction,
  runInAction,
} from 'mobx';

import { StateManager } from '../../StateManager';

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
  height: 1048,
  lines: [],
  width: 1048,
};

const fontCache = new Map<string, FontFace>();

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

    const renderLines = lines
      .filter((line) => line.text.trim().length > 0)
      .slice(0, MAX_LINES);

    await this.preloadLineFonts(renderLines);

    const canvas = this.createCanvas(width, height);

    try {
      if (renderLines.length === 0) {
        return {
          aspect: width / height,
          imageUrl: await this.canvasToBlobUrl(canvas),
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
        this.createTextObjectForBudget(
          line,
          heightBudgets[i],
          usableWidth,
          fontFamily,
          fontWeight,
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
        this.positionTextObjects(textObjects, lineGap * scale, width, height);
      } else {
        this.positionTextObjects(textObjects, lineGap, width, height);
      }

      canvas.add(...textObjects);
      canvas.renderAll();

      return {
        aspect: width / height,
        imageUrl: await this.canvasToBlobUrl(canvas),
      };
    } finally {
      await canvas.dispose();
    }
  }

  private createTextObjectForBudget(
    line: EngravingConfigLine,
    heightBudget: number,
    canvasWidth: number,
    defaultFontFamily: string,
    defaultFontWeight: string,
  ): FabricText {
    const resolvedFamily = this.getFontFamilyForLine(line, defaultFontFamily);
    const resolvedWeight = line.fontWeight ?? defaultFontWeight;
    const fontSize = Math.floor(heightBudget);

    const textObj = new FabricText(line.text, {
      fill: '#575757',
      fontFamily: resolvedFamily,
      fontSize,
      fontWeight: resolvedWeight,
      lineHeight: 1,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    const renderedHeight = textObj.getScaledHeight();
    const renderedWidth = textObj.getScaledWidth();

    const heightScale =
      renderedHeight > heightBudget ? heightBudget / renderedHeight : 1;
    const scaledWidth = renderedWidth * heightScale;
    const widthScale =
      scaledWidth > canvasWidth ? canvasWidth / scaledWidth : 1;

    textObj.set({
      scaleX: heightScale * widthScale,
      scaleY: heightScale,
    });

    return textObj;
  }

  private positionTextObjects(
    textObjects: FabricText[],
    lineGap: number,
    width: number,
    height: number,
  ): void {
    const totalHeight =
      textObjects.reduce((sum, t) => sum + t.getScaledHeight(), 0) +
      lineGap * (textObjects.length - 1);

    let currentY = height / 2 - totalHeight / 2;

    textObjects.forEach((textObj) => {
      const textHeight = textObj.getScaledHeight();
      textObj.set({ left: width / 2, top: currentY + textHeight / 2 });
      currentY += textHeight + lineGap;
    });
  }

  private getFontFamilyForLine(
    line: EngravingConfigLine,
    defaultFontFamily: string,
  ): string {
    if (line.fontUrl)
      return `engraving-font-${this.urlToFamilySlug(line.fontUrl)}`;
    return line.fontFamily ?? defaultFontFamily;
  }

  private urlToFamilySlug(url: string): string {
    return url.replace(/[^a-zA-Z0-9]/g, '_');
  }

  private async preloadLineFonts(lines: EngravingConfigLine[]): Promise<void> {
    const pending = lines
      .filter((line) => line.fontUrl && !fontCache.has(line.fontUrl))
      .map((line) => line.fontUrl as string)
      .filter((url, index, arr) => arr.indexOf(url) === index);

    if (pending.length === 0) return;

    await Promise.all(pending.map((url) => this.loadFontFromUrl(url)));
  }

  private async loadFontFromUrl(url: string): Promise<void> {
    const familyName = `engraving-font-${this.urlToFamilySlug(url)}`;
    const fontFace = new FontFace(familyName, `url(${url})`);
    await fontFace.load();
    document.fonts.add(fontFace);
    fontCache.set(url, fontFace);
  }

  private createCanvas(width: number, height: number): StaticCanvas {
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    return new StaticCanvas(canvasEl, {
      height,
      renderOnAddRemove: false,
      width,
    });
  }

  private async canvasToBlobUrl(canvas: StaticCanvas): Promise<string> {
    const blob = await canvas.toBlob();
    if (!blob) throw new Error('Failed to create blob');
    return URL.createObjectURL(blob);
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
      }))
      .filter((line) => line.text.length > 0);
  }
}
