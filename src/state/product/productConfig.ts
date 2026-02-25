import { ProductConfig, ProductId } from './types';

export const defaultProductId: ProductId = 'dogCollar';

export const productConfigs: Record<ProductId, ProductConfig> = {
  bandana: {
    availableFeatures: [],
    capabilities: {
      hasBuckle: false,
      hasDualCheckout: true,
      hasEngraving: false,
      hasFabricTextResizeUI: false,
      hasHardware: false,
      hasMatchingLeash: false,
    },
    features: {
      buckle: {
        types: [],
      },
      engraving: {
        enabled: false,
      },
      text: {
        enabled: false,
      },
    },
    id: 'bandana',
    model: (_size) => '',
    sizes: [],
  },
  catCollar: {
    availableFeatures: ['size', 'design', 'hardware', 'collar text', 'buckle'],
    capabilities: {
      hasBuckle: true,
      hasDualCheckout: false,
      hasEngraving: false,
      hasFabricTextResizeUI: true,
      hasHardware: false,
      hasMatchingLeash: false,
    },
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
    capabilities: {
      hasBuckle: true,
      hasDualCheckout: false,
      hasEngraving: true,
      hasFabricTextResizeUI: true,
      hasHardware: false,
      hasMatchingLeash: true,
    },
    checkout: {
      includeMatchingLeashSize: '',
    },
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
  harness: {
    availableFeatures: [],
    capabilities: {
      hasBuckle: false,
      hasDualCheckout: false,
      hasEngraving: false,
      hasFabricTextResizeUI: false,
      hasHardware: false,
      hasMatchingLeash: false,
    },
    features: {
      buckle: {
        types: [],
      },
      engraving: {
        enabled: false,
      },
      text: {
        enabled: false,
      },
    },
    id: 'harness',
    model: (_size) => '',
    sizes: [],
  },
  leash: {
    availableFeatures: [],
    capabilities: {
      hasBuckle: false,
      hasDualCheckout: false,
      hasEngraving: false,
      hasFabricTextResizeUI: true,
      hasHardware: true,
      hasMatchingLeash: false,
    },
    features: {
      buckle: {
        types: [],
      },
      engraving: {
        enabled: false,
      },
      text: {
        enabled: false,
      },
    },
    id: 'leash',
    model: (_size) => '',
    sizes: [],
  },
  martingale: {
    availableFeatures: [],
    capabilities: {
      hasBuckle: false,
      hasDualCheckout: false,
      hasEngraving: false,
      hasFabricTextResizeUI: true,
      hasHardware: true,
      hasMatchingLeash: false,
    },
    features: {
      buckle: {
        types: [],
      },
      engraving: {
        enabled: false,
      },
      text: {
        enabled: false,
      },
    },
    id: 'martingale',
    model: (_size) => '',
    sizes: [],
  },
};
