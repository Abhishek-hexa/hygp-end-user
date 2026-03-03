import { ProductConfig, ProductType } from './types';

export const defaultProductId: ProductType = 'DOG_COLLAR';

export const productConfigs: Record<ProductType, ProductConfig> = {
  BANDANA: {
    features: ['FETCH'],
    id: 'BANDANA',
    model: (_size) => '',
    sizes: [],
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
    id: 'CAT_COLLAR',
    model: (_size) => '',
    sizes: ['SMALL', 'LARGE'],
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
    id: 'DOG_COLLAR',
    model: (_size) => '',
    sizes: ['EXTRA_SMALL', 'SMALL', 'MEDIUM_NARROW', 'MEDIUM_WIDE'],
  },
  HARNESS: {
    features: ['FETCH'],
    id: 'HARNESS',
    model: (_size) => '',
    sizes: [],
  },
  LEASH: {
    features: ['HARDWARE', 'FETCH'],
    id: 'LEASH',
    model: (_size) => '',
    sizes: [],
  },
  MARTINGALE: {
    features: ['HARDWARE', 'FETCH'],
    id: 'MARTINGALE',
    model: (_size) => '',
    sizes: [],
  },
};
