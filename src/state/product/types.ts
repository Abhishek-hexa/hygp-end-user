export type ProductId = 'dogCollar' | 'catCollar';

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

export type ProductConfig = {
  id: ProductId;
  sizes: ProductSize[];
  model: (size: ProductSize) => string;
  availableFeatures: Features[];
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
