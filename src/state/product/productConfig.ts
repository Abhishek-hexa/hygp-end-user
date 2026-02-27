import { ProductConfig, ProductId } from './types';

export const defaultProductId: ProductId = 'dogCollar';

export const productConfigs: Record<ProductId, ProductConfig> = {
  bandana: {
    availableFeatures: [],
    tabs: ['size', 'select-design'],
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
        types: ['METAL', 'PLASTIC'],
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
    tabs: ['size', 'select-design', 'buckle', 'collar-text'],
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
    tabs: [
      'size',
      'select-design',
      'buckle',
      'engraving',
      'collar-text',
      'fetch',
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
    sizes: [
      'EXTRA SMALL',
      'SMALL',
      'MEDIUM NARROW',
      'MEDIUM WIDE',
      'LARGE',
      'XLARGE',
      'XXLARGE',
    ],
  },
  harness: {
    availableFeatures: [],
    tabs: ['size', 'select-design'],
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
    availableFeatures: ['size', 'design', 'hardware', 'harness text'],
    tabs: ['size', 'select-design', 'collar-text', 'hardware'],
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
    tabs: ['size', 'select-design'],
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
