import { useCallback, useState } from 'react';

import { leashLabelMap } from '../components/Viewer/ConfigurationTabs/shared/fetchSummary';
import {
  CartPayload,
  CartProduct,
  LeashType,
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

const TEXT_SIZE_MAP: Record<string, string> = {
  LARGE: 'L',
  MEDIUM: 'M',
  SMALL: 'S',
};
function buildCartPayload(
  config: SerializedProductConfiguration,
  uploadedImageUrl: string,
  cartType: CartType,
  redirectToCollar: boolean,
): CartPayload {
  const { size, leash, texture, buckle, engraving, webbing } = config;

  const isMetal = buckle?.material === 'METAL';

  const engravingTextData =
    engraving?.lines.map((line) => ({
      fontId: line.font,
      fontName: line.fontName,
      isStretched: line.isStretched,
      text: isMetal ? line.text : '',
    })) ?? [];

  const webbingFontSizeKey = String(webbing?.size ?? '');

  const primaryProduct: CartProduct = {
    name: `${size?.size?.size ?? ''}_${texture?.patternName ?? ''}`,
    price: parseFloat(String(size?.size?.price ?? 0)).toFixed(2),
    properties: {
      _designName: texture?.patternName ?? '',
      _image: uploadedImageUrl,
      buckleColor: buckle?.colorName ?? '',
      engravingDetails: {
        engravingTextData,
        filePath: null,
      },
      leashSizes: leash?.length ?? null, // ← always, not just when cartType=leash
      materialType: buckle?.material,
      prefix: size?.size?.prefix ?? '',
      selectedPatternItems: texture?.patternName ?? '',
      size: size?.size?.size,
      types: PRODUCT_TYPE_MAP[cartType],
      webbingTextDetails: {
        collarTextColor: webbing?.color ?? '',
        selectedCollarFont: webbing?.fontName ?? '',
        selectedCollarFontSize:
          TEXT_SIZE_MAP[webbingFontSizeKey] ?? webbingFontSizeKey ?? '',
        webbingCollarText: webbing?.value ?? '',
      },
    },
    type: PRODUCT_LABEL_MAP[cartType],
  };

  // Secondary leash product — only when leash + has a length selected
  const products: CartProduct[] = [primaryProduct];

  if (leash?.length) {
    const leashLabel = leashLabelMap[leash.length] ?? `${leash.length} Foot`;
    const leashPrice = parseFloat(String(leash.lengthPrice ?? 0)).toFixed(2);

    const leashProduct: CartProduct = {
      name: `${leashLabel}_${texture?.patternName ?? ''}`,
      price: leashPrice,
      properties: {
        _designName: texture?.patternName ?? '',
        buckleColor: buckle?.colorName ?? '',
        materialType: buckle?.material,
        prefix: size?.size?.prefix ?? '',
        selectedPatternItems: texture?.patternName ?? '',
        size: leashLabel,
        types: LeashType.LEASH,
      },
      type: PRODUCT_TYPE_MAP['leash'],
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

export function useCheckoutPayload(
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
        const base64Url = await design3DManager.takeScreenshot();
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
        productManager.resetSelections();
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
