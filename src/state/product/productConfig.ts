import { ProductConfig, ProductId } from './types';

export const defaultProductId: ProductId = 'dogCollar';

export const productConfigs: Record<ProductId, ProductConfig> = {
  catCollar: {
    availableFeatures: [
      'size', 
      'design', 
      'hardware', 
      'collar text', 
      'buckle'
    ],
    features: {
      buckle: {
        types: ['BREAKAWAY', 'PLASTIC'],
      },
      engraving: {
        enabled: false,
      },
      text: {
        enabled: true,
      },
    },
    id: 'catCollar',
    model: (_size) => '',
    sizes: ['SMALL', 'LARGE'],
  },
  dogCollar: {
    availableFeatures: [
      'size',
      'design',
      'hardware',
      'collar text',
      'buckle',
      'engraving',
    ],
    features: {
      buckle: {
        types: ['METAL', 'PLASTIC'],
      },
      engraving: {
        enabled: true,
        maxLines: 4,
        requiresBuckle: 'METAL',
      },
      text: {
        enabled: true,
        positionable: false,
        scalable: false,
      },
    },
    id: 'dogCollar',
    model: (_size) => '',
    sizes: ['EXTRA SMALL', 'SMALL', 'MEDIUM NARROW', 'MEDIUM WIDE'],
  },
};
