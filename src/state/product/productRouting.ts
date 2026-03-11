import { defaultProductId } from './productConfig';
import { ProductType } from './types';

const productSlugByType: Record<ProductType, string> = {
  BANDANA: 'dog-bandana',
  CAT_COLLAR: 'cat-collar',
  DOG_COLLAR: 'dog-collar',
  HARNESS: 'dog-harness',
  LEASH: 'dog-leash',
  MARTINGALE: 'martingale-collar',
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
