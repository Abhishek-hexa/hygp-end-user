import { defaultProductId } from './productConfig';
import { ProductType } from './types';

const productSlugByType: Record<ProductType, string> = {
  [ProductType.BANDANA]: 'dog-bandana',
  [ProductType.CAT_COLLAR]: 'cat-collar',
  [ProductType.DOG_COLLAR]: 'dog-collar',
  [ProductType.HARNESS]: 'dog-harness',
  [ProductType.LEASH]: 'dog-leash',
  [ProductType.MARTINGALE]: 'martingale-collar',
};

const productTypeBySlug: Record<string, ProductType> = Object.entries(
  productSlugByType,
).reduce(
  (acc, [productType, slug]) => {
    acc[slug] = productType as ProductType;
    return acc;
  },
  {} as Record<string, ProductType>,
);

export const defaultProductSlug = productSlugByType[defaultProductId];

export const productTypeToSlug = (productType: ProductType): string =>
  productSlugByType[productType];

export const productSlugToType = (
  productSlug: string | undefined,
): ProductType | null => {
  if (!productSlug) {
    return null;
  }

  return productTypeBySlug[productSlug] ?? null;
};

export const buildPatternPath = (
  productSlug: string,
  patternId: number,
  isBulkMode: boolean,
): string =>
  isBulkMode
    ? `/${productSlug}/bulk/patterns/${patternId}`
    : `/${productSlug}/pattern/${patternId}`;

export const parsePatternIdParam = (
  patternID: string | undefined,
): number | null => {
  if (!patternID) {
    return null;
  }

  const parsedPatternId = Number.parseInt(patternID, 10);
  return Number.isFinite(parsedPatternId) ? parsedPatternId : null;
};
