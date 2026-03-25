import { FabricText, StaticCanvas } from 'fabric';

export class Service3D {
  static createCanvas(width: number, height: number): StaticCanvas {
    const canvasEl = document.createElement('canvas');
    canvasEl.width = width;
    canvasEl.height = height;
    return new StaticCanvas(canvasEl, {
      height,
      renderOnAddRemove: false,
      width,
    });
  }

  static async canvasToBlobUrl(canvas: StaticCanvas): Promise<string> {
    const blob = await canvas.toBlob();
    if (!blob) throw new Error('Failed to create blob');
    return URL.createObjectURL(blob);
  }

  static createTextObjectForBudget(
    text: string,
    heightBudget: number,
    canvasWidth: number,
    fontFamily: string,
    fontWeight: string,
  ): FabricText {
    const fontSize = Math.floor(heightBudget);

    const textObj = new FabricText(text, {
      fill: '#575757',
      fontFamily,
      fontSize,
      fontWeight,
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

  static positionTextObjects(
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
}
