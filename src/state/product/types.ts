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

export type BuckleType = 'METAL' | 'PLASTIC' | 'BREAKAWAY';
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
  material_id: number;
  material_type: {
    id: string;
    name: string;
  }
  name: string;
  hex: string;
  preview: string;
}

export interface PatternType {
  id: number;
  name: string;
  dataX: string;
  pngImage: string;
  preview: string;
}