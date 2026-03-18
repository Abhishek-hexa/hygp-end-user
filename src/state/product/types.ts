export type ProductType =
  | 'DOG_COLLAR'
  | 'CAT_COLLAR'
  | 'MARTINGALE'
  | 'LEASH'
  | 'BANDANA'
  | 'HARNESS';

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
export type Features =
  | 'SIZE'
  | 'DESIGN'
  | 'HARDWARE'
  | 'COLLAR_TEXT'
  | 'BUCKLE'
  | 'ENGRAVING'
  | 'HARNESS_TEXT'
  | 'FETCH'
  | 'LEASH_TEXT'
  | 'MEOW';

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
  price: string;
  model: string;
  plasticModel: string;
}

export interface ColorDescription {
  id: number;
  materialId: number;
  materialType: {
    id: string;
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
  size: ProductSizeType | null;
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
  collections: number[];
};

export type SerializedProductConfiguration = {
  productId: ProductType;
  price: string | null;
  qty: number;
  size: SerializedSizeConfig;
  buckle: SerializedBuckleConfig;
  engraving: SerializedEngravingConfig;
  webbing: SerializedWebbingConfig;
  texture: SerializedTextureConfig;
};
