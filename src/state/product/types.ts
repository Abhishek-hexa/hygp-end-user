export type ProductId =
  | 'dogCollar'
  | 'catCollar'
  | 'martingale'
  | 'leash'
  | 'bandana'
  | 'harness';

export type ProductSize =
  | 'EXTRA SMALL'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'MEDIUM WIDE'
  | 'MEDIUM NARROW';
export type BuckleType = 'METAL' | 'PLASTIC' | 'BREAKAWAY';
export type TextSize = 'small' | 'medium' | 'large';

type EngravingRule = {
  enabled: boolean;
  maxLines?: number;
  requiresBuckle?: BuckleType;
};

type BuckleRule = {
  types: BuckleType[];
};

type TextRule = {
  enabled: boolean;
  scalable?: boolean;
  positionable?: boolean;
};

export interface ProductCapabilities {
  hasBuckle: boolean;
  hasHardware: boolean;
  hasEngraving: boolean;
  hasFabricTextResizeUI: boolean;
  hasMatchingLeash: boolean;
  hasDualCheckout: boolean;
}

export interface CheckoutConfig {
  includeMatchingLeashSize?: string;
  bandanaRedirectToDogConfigurator?: boolean;
}

export type ProductConfig = {
  id: ProductId;
  sizes: ProductSize[];
  model: (size: ProductSize) => string;
  availableFeatures: Features[];
  capabilities: ProductCapabilities;
  checkout?: CheckoutConfig;
  features: {
    engraving: EngravingRule;
    buckle: BuckleRule;
    text: TextRule;
  };
};

export type Features =
  | 'size'
  | 'design'
  | 'hardware'
  | 'collar text'
  | 'buckle'
  | 'engraving'
  | 'harness text';

export interface EngravingLine {
  text: string;
  font: string;
}

export interface EngravingConfig {
  lines: EngravingLine[];
}

export interface Pattern {
  id: string;
  name: string;
  thumbnail: string;
  textureUrl: string;
}

export interface Collection {
  id: string;
  name: string;
  patterns: Pattern[];
}

export interface SizeOption {
  id: string;
  label: string;
  price: number;
  isDefault?: boolean;
}

export interface BuckleOption {
  id: string;
  type: BuckleType;
  colors: string[];
}

export interface HardwareOption {
  id: string;
  type: 'METAL';
  colors: string[];
}

export interface SizeResponse {
  sizes: SizeOption[];
}

export interface GLBResponse {
  glbUrl: string;
  textureMaps: string[];
  additionalData?: Record<string, unknown>;
}

export interface FabricTextConfig {
  text: string;
  color: string;
  size?: TextSize;
  position?: {
    x: number;
    y: number;
  };
  scale?: number;
}

export interface ProductConfiguration {
  product: ProductId;
  size?: SizeOption;
  design?: Pattern;
  buckle?: BuckleOption;
  hardware?: HardwareOption;
  engraving?: EngravingConfig;
  fabricText?: FabricTextConfig;
  checkout?: CheckoutConfig;
}
