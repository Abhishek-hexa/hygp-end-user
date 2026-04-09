import { ProductType } from '../state/product/types';

export type ProductApiEndpoints = {
  productVariants: string;
  leashVariants?: string;
  buckles?: string;
  engravingFonts: string;
  collections: string;
  patternById: string;
  search: string;
};

export const apiEndPointMap: Record<ProductType, ProductApiEndpoints> = {
  [ProductType.BANDANA]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/dog-bandanas/9022848696535',
    search: '/product/search',
  },
  [ProductType.CAT_COLLAR]: {
    buckles: '/cat-buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/cat-collar/454325797079',
    search: '/product/search',
  },
  [ProductType.DOG_COLLAR]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    leashVariants: '/product/dog-leases/8870433947863',
    patternById: '/product',
    productVariants: '/product/variants/8969048817879',
    search: '/product/search',
  },
  [ProductType.HARNESS]: {
    buckles: '/harness-buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/collar/9116181463255',
    search: '/product/search',
  },
  [ProductType.LEASH]: {
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/dog-leases/8870433947863',
    search: '/product/search',
  },
  [ProductType.MARTINGALE]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/martingale/8975172141271',
    search: '/product/search',
  },
};

// Backward-compat alias for old imports.
export const apiPoints = apiEndPointMap;
