export type ProductIdType =
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

export type BuckleNameType = 'BUCKLE' | 'HARWARE';

export interface ApiProductVariant {
  id: string;
  modelUrl: string;
  name: string;
  plasticModelUrl: string;
  prefix?: string; // 'XS'
  size: ProductSizeType; // 'EXTRA SMALL'
  price: number;
  sizeImageUrl?: string;
}

export interface ProductVariantsResponse {
  variants: ApiProductVariant[];
}

export interface ApiBuckleOption {
  id: string;
  name: string; // Tab name BUCKLE or HARDWARE
  metalColors?: string[];
  plasticColors?: string[];
  breakawayColors?: string[];
  type: BuckleType;
}

export interface ApiFontOption {
  fontUrl?: string; // Path
  longName: string; // Full Name
  shortName: string; // Display Name for UI
  id: string;
  previewUrl: string; // photo for preview in UI
  useCases?: string[]; // ENGRAVING or  WEBBING 
}

export interface ApiCollection { // one Collection 
  id: string;
  name: string;
}

export interface ApiCollectionResponse { // list collections
  collections: ApiCollection[]
}

export interface Pattern { // one collection's textures
  dataX?: string;
  id: string;
  name: string;
  previewUrl?: string;
  textureUrl: string; // jpeg or webp
}

//GET/collection-id
export interface AllCollectionResonse {
  textures: Pattern[];
}
