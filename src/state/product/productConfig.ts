import { ProductConfig, ProductType } from './types';

export const defaultProductId: ProductType = 'DOG_COLLAR';

export const productConfigs: Record<ProductType, ProductConfig> = {
  BANDANA: {
    features: ['FETCH'],
  },
  CAT_COLLAR: {
    features: [
      'SIZE',
      'DESIGN',
      'HARDWARE',
      'COLLAR_TEXT',
      'MEOW',
    ],
    buckleMaterials: ['BREAKAWAY', 'PLASTIC'],
  },
  DOG_COLLAR: {
    features: [
      'SIZE',
      'DESIGN',
      'BUCKLE',
      'ENGRAVING',
      'COLLAR_TEXT',
      'FETCH',
    ],
    buckleMaterials: ['METAL','PLASTIC'],
  },
  HARNESS: {
    features: [
      'SIZE',
      'DESIGN',
      'HARNESS_TEXT',
      'FETCH',
    ],
  },
  LEASH: {
    features: [
      'SIZE',
      'DESIGN',
      'HARDWARE',
      'LEASH_TEXT',
      'FETCH',
    ],
  },
  MARTINGALE: {
    features: [
      'SIZE',
      'DESIGN',
      'HARDWARE',
      'COLLAR_TEXT',
      'FETCH',
    ],
  },
};
