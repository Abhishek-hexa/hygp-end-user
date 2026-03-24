import { FabricText, StaticCanvas } from 'fabric';
import { makeAutoObservable, runInAction } from 'mobx';

import { StateManager } from '../../StateManager';

export const DEFAULT_ENGRAVING_CONFIG: EngravingConfig = {
  height: 1024,
  textLines: ['Parth', 'Chauhan', 'some'],
  width: 1024,
};

export type EngravingConfig = {
  textLines: string[];
  width: number;
  height: number;
  fontFamily?: string;
  fontWeight?: string;
};

export class Engraving3Dmanager {
  private _libstate: StateManager;
  config: EngravingConfig;
  imageUrl: string | null = null;
  aspect: number;
  loading = false;
  error: string | null = null;

  private requestId = 0;

  constructor(
    inLibstate: StateManager,
    initialConfig: EngravingConfig = DEFAULT_ENGRAVING_CONFIG,
  ) {
    this._libstate = inLibstate;
    this.config = {
      ...initialConfig,
      textLines: [...initialConfig.textLines],
    };
    this.aspect = this.config.width / this.config.height;
    makeAutoObservable(this);

    // Ensure we have an initial texture even if no config update is fired.
    void this.refreshTexture();
  }

  setConfig(partial: Partial<EngravingConfig>) {
    this.config = {
      ...this.config,
      ...partial,
      textLines: partial.textLines
        ? [...partial.textLines]
        : [...this.config.textLines],
    };
    void this.refreshTexture();
  }

  async refreshTexture() {
    const currentRequestId = ++this.requestId;
    this.loading = true;
    this.error = null;

    console.log('here')

    try {
      const result = await this.generateEngravingTexture(this.config);

      console.log(result)
      if (currentRequestId !== this.requestId) {
        URL.revokeObjectURL(result.imageUrl);
        return;
      }

      runInAction(() => {
        if (this.imageUrl) {
          URL.revokeObjectURL(this.imageUrl);
        }
        this.imageUrl = result.imageUrl;
        this.aspect = result.aspect;
        this.loading = false;
      });
    } catch (error) {
      if (currentRequestId !== this.requestId) {
        return;
      }
      console.log(error)
      runInAction(() => {
        this.loading = false;
        this.error =
          error instanceof Error
            ? error.message
            : 'Failed to generate engraving texture';
      });
    }
  }

  private async generateEngravingTexture(config: EngravingConfig): Promise<{
    imageUrl: string;
    aspect: number;
  }> {
    const {
      textLines,
      width,
      height,
      fontFamily = 'Arial',
      fontWeight = 'bold',
    } = config;

    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    const canvas = new StaticCanvas(canvasEl, {
      height,
      renderOnAddRemove: false,
      width,
    });


    try {
      const lineCount = textLines.length;
      if (lineCount === 0) {
        return {
          aspect: width / height,
          imageUrl: await this.canvasToBlobUrl(canvas),
        };
      }

      const maxTextWidth = width * 0.86;
      const lineGap = height * 0.05;
      let fontSize = Math.floor((height * 0.85) / lineCount);

      const createTextObjects = (size: number) => {
        return textLines.map((line) => {
          return new FabricText(line, {
            fill: '#fff',
            fontFamily,
            fontSize: size,
            fontWeight,
            lineHeight: 1,
            originX: 'center',
            originY: 'center',
            textAlign: 'center',
          });
        });
      };

      const fits = (size: number) => {
        const textObjects = createTextObjects(size);
        const widestLine = textObjects.reduce((maxWidth, textObj) => {
          return Math.max(maxWidth, textObj.width ?? 0);
        }, 0);
        const totalHeight =
          textObjects.reduce(
            (sum, textObj) => sum + (textObj.height ?? size),
            0,
          ) +
          lineGap * (lineCount - 1);
        return widestLine <= maxTextWidth && totalHeight <= height * 0.86;
      };

      while (fontSize > 8 && !fits(fontSize)) {
        fontSize -= 1;
      }

      const textObjects = createTextObjects(fontSize);
      const contentHeight =
        textObjects.reduce(
          (sum, textObj) => sum + (textObj.height ?? fontSize),
          0,
        ) +
        lineGap * (lineCount - 1);
      let currentY = height / 2 - contentHeight / 2;

      textObjects.forEach((textObj) => {
        const textHeight = textObj.height ?? fontSize;
        textObj.set({
          left: width / 2,
          top: currentY + textHeight / 2,
        });
        currentY += textHeight + lineGap;
      });
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

  private async canvasToBlobUrl(canvas: StaticCanvas): Promise<string> {
    const blob = await canvas.toBlob();
    if (!blob) {
      throw new Error('Failed to create blob');
    }
    return URL.createObjectURL(blob);
  }

  dispose() {
    this.requestId += 1;
    if (this.imageUrl) {
      URL.revokeObjectURL(this.imageUrl);
      this.imageUrl = null;
    }
  }
}
