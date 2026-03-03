export type ProductType =
  | 'DOG_COLLAR'
  | 'CAT_COLLAR'
  | 'MARTINGALE'
  | 'LEASH'
  | 'BANDANA'
  | 'HARNESS';
export type ProductIdType = ProductType;

export type ProductSizeType =
  | 'EXTRA_SMALL'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'XLARGE'
  | 'XXLARGE'
  | 'MEDIUM_WIDE'
  | 'MEDIUM_NARROW';

export type BuckleType = 'METAL' | 'PLASTIC' | 'BREAKAWAY';
export type BuckleNameType = 'BUCKLE' | 'HARWARE';
export type TextSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export type Features =
  | 'SIZE'
  | 'DESIGN'
  | 'HARDWARE'
  | 'COLLAR_TEXT'
  | 'BUCKLE'
  | 'ENGRAVING'
  | 'HARNESS_TEXT'
  | 'FETCH';

export type LeashLengthType = '3' | '4' | '5' | '6';

export type ProductConfig = {
  features: Features[];
};

export interface ApiProductVariant {
  id: number;
  modelUrl: string;
  name: string;
  plasticModelUrl: string;
  prefix?: string;
  size: ProductSizeType;
  price: number;
  sizeImageUrl?: string;
}

export interface ProductVariantsResponse {
  variants: ApiProductVariant[];
}

export interface ApiBuckleOption {
  id: number;
  name: string;
  metalColors?: string[];
  plasticColors?: string[];
  breakawayColors?: string[];
  type: BuckleType;
}

export interface ApiFontOption {
  fontUrl?: string;
  name: string;
  id: number;
  previewUrl: string;
  useCases?: string[];
}

export interface ApiCollection {
  id: number;
  name: string;
}

export interface ApiCollectionResponse {
  collections: ApiCollection[];
}

export interface ApiPattern {
  dataX?: string;
  id: number;
  name: string;
  previewUrl?: string;
  textureUrl: string;
}

export interface AllPatternResonse {
  textures: ApiPattern[];
}
