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
      'BUCKLE',
      'FETCH',
    ],
  },
  DOG_COLLAR: {
    features: [
      'SIZE',
      'DESIGN',
      'HARDWARE',
      'COLLAR_TEXT',
      'BUCKLE',
      'ENGRAVING',
      'FETCH',
    ],
  },
  HARNESS: {
    features: ['FETCH'],
  },
  LEASH: {
    features: ['HARDWARE', 'FETCH'],
  },
  MARTINGALE: {
    features: ['HARDWARE', 'FETCH'],
  },
};
