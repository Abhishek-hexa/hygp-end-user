export enum ProductType {
  DOG_COLLAR = 'DOG_COLLAR',
  CAT_COLLAR = 'CAT_COLLAR',
  MARTINGALE = 'MARTINGALE',
  LEASH = 'LEASH',
  BANDANA = 'BANDANA',
  HARNESS = 'HARNESS',
}

export type ProductSizeType =
  | 'EXTRA_SMALL'
  | 'SMALL'
  | 'MEDIUM'
  | 'LARGE'
  | 'XLARGE'
  | 'XXLARGE'
  | 'MEDIUM_WIDE'
  | 'MEDIUM_NARROW';

export type BuckleMaterialType = 'METAL' | 'PLASTIC' | 'BREAKAWAY';
export type TextSize = 'SMALL' | 'MEDIUM' | 'LARGE';
export enum Feature {
  SIZE = 'SIZE',
  DESIGN = 'DESIGN',
  HARDWARE = 'HARDWARE',
  COLLAR_TEXT = 'COLLAR_TEXT',
  BUCKLE = 'BUCKLE',
  ENGRAVING = 'ENGRAVING',
  HARNESS_TEXT = 'HARNESS_TEXT',
  FETCH = 'FETCH',
  LEASH_TEXT = 'LEASH_TEXT',
  MEOW = 'MEOW',
}
export type Features =
  | Feature.SIZE
  | Feature.DESIGN
  | Feature.HARDWARE
  | Feature.COLLAR_TEXT
  | Feature.BUCKLE
  | Feature.ENGRAVING
  | Feature.HARNESS_TEXT
  | Feature.FETCH
  | Feature.LEASH_TEXT
  | Feature.MEOW;

export type LeashLengthType = '3' | '4' | '5' | '6';

export type ProductConfig = {
  features: Features[];
  buckleMaterials?: BuckleMaterialType[];
};

export interface Collection {
  id: number;
  image: string;
  title: string;
}

export interface SizeDescription {
  id: number;
  size: ProductSizeType;
  price: string;
  model: string;
  plasticModel: string;
  sizeImage: string;
}

export interface ColorDescription {
  id: number;
  materialId: number;
  materialType: {
    id: number;
    name: string;
  };
  name: string;
  hex: string;
  preview: string;
}

export interface PatternType {
  id: number;
  collectionId: number;
  name: string;
  dataX: string;
  pngImage: string;
  preview: string;
}

export interface FontDescription {
  id: number;
  name: string;
  preview: string;
  font_path: string;
}

export type SerializedSizeConfig = {
  size: SizeDescription | null;
  length: LeashLengthType | null;
};

export type SerializedBuckleConfig = {
  material: BuckleMaterialType | null;
  color: number | null;
};

export type SerializedEngravingLine = {
  text: string;
  font: number | null;
};

export type SerializedEngravingConfig = {
  lines: SerializedEngravingLine[];
};

export type SerializedWebbingConfig = {
  value: string;
  size: TextSize;
  font: number | null;
  color: string;
};

export type SerializedTextureConfig = {
  pattern: number | null;
  collections: number;
};

export type SerializedProductConfiguration = {
  key: string;
  productId: ProductType;
  price: string | null;
  qty: number;
  size: SerializedSizeConfig | null;
  buckle: SerializedBuckleConfig;
  engraving: SerializedEngravingConfig;
  webbing: SerializedWebbingConfig;
  texture: SerializedTextureConfig;
};
