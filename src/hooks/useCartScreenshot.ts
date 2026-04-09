import { useCallback, useState } from 'react';

import {
  ProductType,
  SerializedProductConfiguration,
} from '../state/product/types';
import { useMainContext } from './useMainContext';
import { useUploadImageMutation } from './useUploadImageMutation';

type CartType =
  | 'bandana'
  | 'cat'
  | 'collar'
  | 'harness'
  | 'leash'
  | 'martingale';

interface CartProduct {
  name: string;
  price: string;
  type: string;
  properties: Record<string, unknown>;
}

export interface CartPayload {
  type: 'ADD_TO_CART';
  products: CartProduct[];
  redirectData?: {
    collectionId: number | undefined;
    patternId: number | null;
    patternName: number | null;
    size: string | undefined;
  }[];
}

const PRODUCT_TYPE_MAP: Record<CartType, ProductType> = {
  bandana: ProductType.BANDANA,
  cat: ProductType.CAT_COLLAR,
  collar: ProductType.DOG_COLLAR,
  harness: ProductType.HARNESS,
  leash: ProductType.LEASH,
  martingale: ProductType.MARTINGALE,
};

const PRODUCT_LABEL_MAP: Record<CartType, string> = {
  bandana: 'bandana',
  cat: 'collar',
  collar: 'collar',
  harness: 'harness',
  leash: 'leash',
  martingale: 'martingale',
};

// Matches old CollarSize map: fontSize → size label
const COLLAR_SIZE_MAP: Record<string, string> = {
  '0.5': 'S',
  '0.75': 'M',
  '1': 'L',
};

function buildCartPayload(
  config: SerializedProductConfiguration,
  uploadedImageUrl: string,
  cartType: CartType,
  redirectToCollar: boolean,
): CartPayload {
  const { size, texture, buckle, engraving, webbing, price } = config;

  const isLeash = cartType === 'leash';
  const isMetal = buckle?.material === 'METAL';

  const engravingTextData = (engraving?.lines ?? []).map((line) => ({
    font: line.font,
    fontName: line.fontName,
    isStretched: line.isStretched,
    text: isMetal ? line.text : '',
  }));

  const webbingFontSizeKey = String(webbing?.size ?? '');
  const COLLAR_SIZE_MAP: Record<string, string> = {
    '0.5': 'S',
    '0.75': 'M',
    '1': 'L',
  };

  const primaryProduct: CartProduct = {
    name: `${size?.size?.size ?? ''}_${texture?.patternName ?? ''}`,
    price: parseFloat(String(price ?? 0)).toFixed(2),
    properties: {
      _designName: texture?.patternName ?? '',
      _image: uploadedImageUrl,
      buckleColor: buckle?.colorName ?? '',
      // leash length e.g. '4'
      engravingDetails: {
        engravingTextData,
      },

      leashSizes: isLeash ? (size?.length ?? null) : null,

      materialType: buckle?.material,

      selectedPatternItems: texture?.patternName ?? '',

      size: size?.size?.size,
      // collar/harness size e.g. 'MEDIUM'
      types: PRODUCT_TYPE_MAP[cartType],
      webbingTextDetails: {
        collarTextColor: webbing?.color ?? '',
        selectedCollarFont: webbing?.font,
        selectedCollarFontSize:
          COLLAR_SIZE_MAP[webbingFontSizeKey] ?? webbingFontSizeKey,
        webbingCollarText: webbing?.value ?? '',
      },
    },
    type: PRODUCT_LABEL_MAP[cartType],
  };

  // Secondary leash product — only when leash + has a length selected
  const products: CartProduct[] = [primaryProduct];

  if (isLeash && size?.length) {
    const leashPrice = parseFloat(String(size.lengthPrice ?? 0)).toFixed(2);

    const leashProduct: CartProduct = {
      name: `${size.length}_${texture?.patternName ?? ''}`,
      price: leashPrice,
      properties: {
        _designName: texture?.patternName ?? '',
        // leash length '3'|'4'|'5'|'6'
        buckleColor: buckle?.colorName ?? '',
        materialType: buckle?.material,
        prefix: size?.size?.prefix ?? '',
        selectedPatternItems: texture?.patternName ?? '',
        size: size.length,
        types: ProductType.LEASH,
      },
      type: 'leash',
    };
    products.push(leashProduct);
  }

  const payload: CartPayload = {
    products,
    type: 'ADD_TO_CART',
  };

  if (redirectToCollar) {
    payload.redirectData = [
      {
        collectionId: texture?.collections,
        patternId: texture?.pattern,
        patternName: texture?.pattern,
        size: size?.size?.size,
      },
    ];
  }

  return payload;
}

export function useCartScreenshot(
  onBeforePost?: (payload: CartPayload) => CartPayload,
) {
  const mainContext = useMainContext();
  const design3DManager = mainContext.design3DManager;
  const productManager = mainContext.designManager.productManager;

  const { mutateAsync: uploadImage } = useUploadImageMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takeCartScreenshot = useCallback(
    async (cartType: CartType, redirectToCollar = false) => {
      setIsLoading(true);
      setError(null);

      try {
        const base64Url = design3DManager.takeScreenshot();
        if (!base64Url) throw new Error('Screenshot failed — canvas not ready');

        const res = await fetch(base64Url);
        const blob = await res.blob();
        const file = new File([blob], 'preview.webp', { type: blob.type });

        const uploadData = (await uploadImage(file)) as { image: string };
        const imageUrl: string =
          typeof uploadData?.image === 'string' ? uploadData.image : '';

        const config = productManager.serializeConfiguration();

        const payload = buildCartPayload(
          config,
          imageUrl,
          cartType,
          redirectToCollar,
        );

        const finalPayload = onBeforePost ? onBeforePost(payload) : payload;

        window.parent.postMessage(finalPayload, '*');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Add to cart failed');
      } finally {
        setIsLoading(false);
      }
    },
    [design3DManager, productManager, onBeforePost, uploadImage],
  );

  return { error, isLoading, takeCartScreenshot };
}
