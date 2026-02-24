import { ProductConfig, ProductId } from './types';

export const defaultProductId: ProductId = 'dogCollar';

export const productConfigs: Record<ProductId, ProductConfig> = {
  catCollar: {
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
    model: (_size) => '/glbs/TShirt.glb',
    sizes: ['SMALL', 'LARGE'],
  },
  dogCollar: {
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
    model: (_size) => '/glbs/TShirt.glb',
    sizes: ['EXTRA SMALL', 'SMALL', 'MEDIUM NARROW', 'MEDIUM WIDE'],
  },
};
