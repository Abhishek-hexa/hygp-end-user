import { ProductConfig, ProductType } from './types';

export const defaultProductId: ProductType = ProductType.DOG_COLLAR;

export const productConfigs: Record<ProductType, ProductConfig> = {
  [ProductType.BANDANA]: {
    features: ['SIZE', 'DESIGN', 'COLLAR_TEXT', 'FETCH'],
  },
  [ProductType.CAT_COLLAR]: {
    buckleMaterials: ['BREAKAWAY', 'PLASTIC'],
    features: ['SIZE', 'DESIGN', 'HARDWARE', 'COLLAR_TEXT', 'MEOW'],
  },
  [ProductType.DOG_COLLAR]: {
    buckleMaterials: ['METAL', 'PLASTIC'],
    features: ['SIZE', 'DESIGN', 'BUCKLE', 'ENGRAVING', 'COLLAR_TEXT', 'FETCH'],
  },
  [ProductType.HARNESS]: {
    features: ['SIZE', 'DESIGN', 'HARNESS_TEXT', 'FETCH'],
  },
  [ProductType.LEASH]: {
    features: ['SIZE', 'DESIGN', 'HARDWARE', 'LEASH_TEXT', 'FETCH'],
  },
  [ProductType.MARTINGALE]: {
    features: ['SIZE', 'DESIGN', 'HARDWARE', 'COLLAR_TEXT', 'FETCH'],
  },
};
