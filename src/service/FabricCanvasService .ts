import { FabricText, StaticCanvas } from 'fabric';
import * as THREE from 'three';

import { TextSize } from '../state/product/types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FittedTextOptions {
  text: string;
  heightBudget: number;
  maxWidth: number;
  fontFamily: string;
  fontWeight: string;
  fill?: string;
}

export interface WebbingTextureOptions {
  mesh: THREE.Mesh;
  text: string;
  fontFamily: string;
  color: string;
  fontSize: TextSize;
}

export interface EngravingRenderLine {
  text: string;
  fontFamily: string;
  fontWeight: string;
}

export interface EngravingTextureOptions {
  lines: EngravingRenderLine[];
  width: number;
  height: number;
}

export interface TextureResult {
  imageUrl: string;
  normalUrl?: string;
  aspect: number;
}

// ─── Config ───────────────────────────────────────────────────────────────────

export interface FabricCanvasServiceConfig {
  /** Fill color for engraving text. Default: '#575757' */
  engravingFill?: string;
  /** Vertical padding ratio for engraving canvas. Default: 0.05 */
  engravingPaddingYRatio?: number;
  /** Horizontal padding ratio for engraving canvas. Default: 0.01 */
  engravingPaddingXRatio?: number;
  /** Gap between lines as ratio of canvas height. Default: 0.002 */
  lineGapRatio?: number;
  /**
   * Hero (first) line height ratio per total line count.
   * Controls how dominant the first line is relative to secondary lines.
   */
  heroHeightRatios?: Record<number, number>;
  /**
   * Scale multiplier per font size tier for webbing text.
   */
  fontScaleMap?: Record<TextSize, number>;
  /**
   * Horizontal scale tuning for webbing text canvas-to-mesh UV mapping.
   * Default: 0.681
   */
  webbingScaleX?: number;
}

const DEFAULT_CONFIG: Required<FabricCanvasServiceConfig> = {
  engravingFill: '#575757',
  engravingPaddingYRatio: 0.05,
  engravingPaddingXRatio: 0.01,
  lineGapRatio: 0.002,
  heroHeightRatios: {
    1: 1.0,
    2: 0.75,
    3: 0.55,
    4: 0.35,
  },
  fontScaleMap: {
    SMALL: 0.5,
    MEDIUM: 0.75,
    LARGE: 1,
  },
  webbingScaleX: 0.681,
};

// ─── Service ──────────────────────────────────────────────────────────────────

/**
 * Core business service for all Fabric.js canvas operations.
 *
 * Responsibilities:
 *  - Canvas creation and disposal
 *  - Text object creation and scaling
 *  - Multi-line layout and positioning
 *  - Canvas trimming
 *  - Engraving texture generation
 *  - Webbing text texture generation
 *
 * Font loading and MobX state are intentionally outside this class.
 * Inject an instance wherever canvas rendering is needed.
 *
 * @example
 * // Default usage
 * const fabricService = new FabricCanvasService();
 *
 * // Custom config (e.g. different fill for a product line)
 * const fabricService = new FabricCanvasService({ engravingFill: '#333333' });
 */
export class FabricCanvasService {
  private readonly config: Required<FabricCanvasServiceConfig>;

  constructor(config: FabricCanvasServiceConfig = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  // ─── Canvas Lifecycle ───────────────────────────────────────────────────────

  /**
   * Creates a Fabric StaticCanvas backed by a new HTMLCanvasElement.
   */
  createCanvas(width: number, height: number): StaticCanvas {
    const el = document.createElement('canvas');
    el.width = width;
    el.height = height;
    return new StaticCanvas(el, { width, height, renderOnAddRemove: false });
  }

  /**
   * Exports a Fabric StaticCanvas to a blob URL.
   * Caller is responsible for revoking the URL.
   */
  async canvasToBlobUrl(canvas: StaticCanvas): Promise<string> {
    const blob = await canvas.toBlob();
    if (!blob) throw new Error('Failed to convert Fabric canvas to blob');
    return URL.createObjectURL(blob);
  }

  /**
   * Exports a native HTMLCanvasElement to a blob URL.
   * Caller is responsible for revoking the URL.
   */
  htmlCanvasToBlobUrl(canvas: HTMLCanvasElement): Promise<string> {
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob)
          return reject(new Error('Failed to create blob from HTML canvas'));
        resolve(URL.createObjectURL(blob));
      }, 'image/png');
    });
  }

  // ─── Text Object ───────────────────────────────────────────────────────────

  /**
   * Creates a FabricText object scaled to fit within a height and width budget.
   * Scale is computed to respect both axes — text will never overflow its container.
   */
  createFittedTextObject({
    text,
    heightBudget,
    maxWidth,
    fontFamily,
    fontWeight,
    fill,
  }: FittedTextOptions): FabricText {
    const textObj = new FabricText(text, {
      fill: fill ?? this.config.engravingFill,
      fontFamily,
      fontWeight,
      fontSize: Math.floor(heightBudget),
      lineHeight: 1,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
    });

    const scaleH = Math.min(1, heightBudget / textObj.getScaledHeight());
    const scaleW = Math.min(1, maxWidth / (textObj.getScaledWidth() * scaleH));

    textObj.set({ scaleX: scaleH * scaleW, scaleY: scaleH });

    return textObj;
  }

  // ─── Layout ────────────────────────────────────────────────────────────────

  /**
   * Vertically centers a list of text objects on a canvas,
   * distributing them with the given line gap.
   */
  positionTextObjects(
    textObjects: FabricText[],
    lineGap: number,
    canvasWidth: number,
    canvasHeight: number,
  ): void {
    const totalH =
      textObjects.reduce((sum, t) => sum + t.getScaledHeight(), 0) +
      lineGap * (textObjects.length - 1);

    let y = canvasHeight / 2 - totalH / 2;

    for (const obj of textObjects) {
      const h = obj.getScaledHeight();
      obj.set({ left: canvasWidth / 2, top: y + h / 2 });
      y += h + lineGap;
    }
  }

  // ─── Canvas Trimming ────────────────────────────────────────────────────────

  /**
   * Crops a canvas to the bounding box of all non-transparent pixels.
   * Returns the original canvas unchanged if fully transparent.
   */
  trimTransparentEdges(source: HTMLCanvasElement, heightOnly: boolean = false, paddingY: number = 0, trimLeft: boolean = false): HTMLCanvasElement {
    const ctx = source.getContext('2d')!;
    const { width, height } = source;
    const { data } = ctx.getImageData(0, 0, width, height);

    let top = -1,
      bottom = -1,
      left = width,
      right = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (data[(y * width + x) * 4 + 3] > 0) {
          if (top === -1) top = y;
          bottom = y;
          if (!heightOnly || trimLeft) {
            if (x < left) left = x;
            if (x > right) right = x;
          }
        }
      }
    }

    if (top === -1) return source;

    if (heightOnly) {
      left = trimLeft ? left : 0;
      right = width - 1;
    }

    const paddedTop = Math.max(0, top - paddingY);
    const paddedBottom = Math.min(height - 1, bottom + paddingY);

    const w = right - left + 1;
    const h = paddedBottom - paddedTop + 1;
    const trimmed = document.createElement('canvas');
    trimmed.width = w;
    trimmed.height = h;
    trimmed
      .getContext('2d')!
      .putImageData(ctx.getImageData(left, paddedTop, w, h), 0, 0);

    return trimmed;
  }

  // ─── Engraving Texture ─────────────────────────────────────────────────────

  /**
   * Renders multi-line engraving text onto a canvas and returns a trimmed
   * blob URL with the correct aspect ratio.
   *
   * Font loading must be completed by the caller before invoking this method.
   * Each line's `fontFamily` should already be the resolved family name.
   *
   * Returns a blob URL — caller is responsible for revoking it.
   */
  async generateEngravingTexture({
    lines,
    width,
    height,
  }: EngravingTextureOptions): Promise<TextureResult> {
    const canvas = this.createCanvas(width, height);

    try {
      if (lines.length === 0) {
        return {
          imageUrl: await this.canvasToBlobUrl(canvas),
          aspect: width / height,
        };
      }

      const {
        lineGapRatio,
        engravingPaddingXRatio,
        engravingPaddingYRatio,
        heroHeightRatios,
      } = this.config;

      const paddingX = width * engravingPaddingXRatio;
      const paddingY = height * engravingPaddingYRatio;
      const usableW = width - paddingX * 2;
      const usableHMax = height - paddingY * 2;

      const lineCount = lines.length;
      const lineGap = lineGapRatio * height;
      const usableH = usableHMax - lineGap * (lineCount - 1);

      const heroRatio = heroHeightRatios[lineCount] ?? 0.4;
      const secondaryRatio =
        lineCount > 1 ? (1 - heroRatio) / (lineCount - 1) : 0;

      // Build text objects with budgeted heights
      const textObjects = lines.map((line, i) =>
        this.createFittedTextObject({
          text: line.text,
          heightBudget: usableH * (i === 0 ? heroRatio : secondaryRatio),
          maxWidth: usableW,
          fontFamily: line.fontFamily,
          fontWeight: line.fontWeight,
        }),
      );

      // Scale everything down uniformly if total height overflows
      const totalRenderedH =
        textObjects.reduce((sum, t) => sum + t.getScaledHeight(), 0) +
        lineGap * (lineCount - 1);

      if (totalRenderedH > usableHMax) {
        const scale = usableHMax / totalRenderedH;
        textObjects.forEach((t) =>
          t.set({
            scaleX: (t.scaleX ?? 1) * scale,
            scaleY: (t.scaleY ?? 1) * scale,
          }),
        );
        this.positionTextObjects(textObjects, lineGap * scale, width, height);
      } else {
        this.positionTextObjects(textObjects, lineGap, width, height);
      }

      canvas.add(...textObjects);
      canvas.renderAll();

      const trimmed = this.trimTransparentEdges(canvas.getElement());
      const imageUrl = await this.htmlCanvasToBlobUrl(trimmed);
      const normalUrl = await this.generateNormalMap(trimmed);

      return { imageUrl, normalUrl, aspect: trimmed.width / trimmed.height };
    } finally {
      await canvas.dispose();
    }
  }

  // ─── Normal Map Generation ──────────────────────────────────────────────────

  /**
   * Generates a normal map from the given canvas using height-mapping logic.
   * `pixelOffsetBytes` controls the gradient step size (default 8 bytes = 2 pixels).
   */
  async generateNormalMap(source: HTMLCanvasElement, pixelOffsetBytes: number = 8): Promise<string> {
    const { width, height } = source;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d', { willReadFrequently: true })!;
    context.imageSmoothingEnabled = false;
    context.imageSmoothingQuality = 'low';
    context.drawImage(source, 0, 0, width, height);

    const src = context.getImageData(0, 0, width, height);
    const dst = context.createImageData(width, height);

    for (let i = 0; i < width * height * 4; i += 4) {
      let x1, x4;
      if (i % (width * 4) === 0) {
        x1 = src.data[i];
        x4 = src.data[i + pixelOffsetBytes];
      } else if (i % (width * 4) === 4) {
        x1 = src.data[i - 4];
        x4 = src.data[i + pixelOffsetBytes];
      } else if (i % (width * 4) === (width - 2) * 4) {
        x1 = src.data[i - pixelOffsetBytes];
        x4 = src.data[i];
      } else if (i % (width * 4) === (width - 1) * 4) {
        x1 = src.data[i - pixelOffsetBytes];
        x4 = src.data[i];
      } else {
        x1 = src.data[i - pixelOffsetBytes];
        x4 = src.data[i + pixelOffsetBytes];
      }

      let y1, y4;
      if (i < width * 4) {
        y1 = src.data[i];
        y4 = src.data[i + width * pixelOffsetBytes];
      } else if (i >= (height - 2) * width * 4) {
        y1 = src.data[i - width * pixelOffsetBytes];
        y4 = src.data[i];
      } else if (i >= (height - 1) * width * 4) {
        y1 = src.data[i - width * pixelOffsetBytes];
        y4 = src.data[i];
      } else {
        y1 = src.data[i - width * pixelOffsetBytes];
        y4 = src.data[i + width * pixelOffsetBytes];
      }

      const dx = ((x4 || 0) - (x1 || 0)) / 255;
      const dy = ((y4 || 0) - (y1 || 0)) / 255;
      const dz = 1;

      const length = Math.sqrt(dx * dx + dy * dy + dz * dz);
      const nx = dx / length;
      const ny = dy / length;

      dst.data[i] = (nx + 1) * 127;
      dst.data[i + 1] = (ny + 1) * 127;
      dst.data[i + 2] = 255;
      dst.data[i + 3] = 255;
    }

    context.putImageData(dst, 0, 0);
    return await this.htmlCanvasToBlobUrl(canvas);
  }

  // ─── Webbing Text Texture ──────────────────────────────────────────────────

  /**
   * Renders a single line of styled text onto a canvas sized to the mesh
   * bounding box, and returns a blob URL.
   *
   * Font loading must be completed by the caller before invoking this method.
   * `fontFamily` should already be the resolved family name.
   *
   * Returns a blob URL — caller is responsible for revoking it.
   */
  async generateWebbingTexture({
    mesh,
    text,
    fontFamily,
    color,
    fontSize,
  }: WebbingTextureOptions): Promise<string> {
    mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox;
    if (!box) throw new Error('Mesh geometry has no bounding box');

    const size = new THREE.Vector3();
    box.getSize(size);

    const canvasW = size.x * 15;
    const canvasH = size.y * 15;

    const canvas = this.createCanvas(canvasW, canvasH);

    try {
      const computedFontSize = canvasH * 0.7 * this.config.fontScaleMap[fontSize];
      const textObj = new FabricText(text, {
        fill: color,
        stroke: '#000000',
        strokeWidth: computedFontSize * 0.08,
        strokeUniform: true,
        paintFirst: 'stroke',
        fontFamily,
        fontSize: computedFontSize,
        originX: 'left',
        originY: 'center',
        textAlign: 'left',
        top: canvasH / 2,
        scaleX: this.config.webbingScaleX,
        scaleY: 1,
      });

      // Fit width to prevent text from overflowing the canvas when using wider fonts
      const currentWidth = textObj.getScaledWidth();
      const maxUsableWidth = canvasW ;
      if (currentWidth > maxUsableWidth) {
        const fitScale = maxUsableWidth / currentWidth;
        textObj.set({
          scaleX: (textObj.scaleX ?? 1) * fitScale,
          scaleY: (textObj.scaleY ?? 1) * fitScale,
        });
      }

      canvas.add(textObj);
      canvas.renderAll();

      const paddingY = Math.floor(canvasH * 0.1);
      const trimmed = this.trimTransparentEdges(canvas.getElement(), true, paddingY, true);
      return await this.htmlCanvasToBlobUrl(trimmed);
    } finally {
      await canvas.dispose();
    }
  }
}
