import { ProductType } from '../state/product/types';

export type ProductApiEndpoints = {
  productVariants: string;
  leashVariants?: string;
  buckles?: string;
  engravingFonts: string;
  collections: string;
  patternById: string;
};

export const apiEndPointMap: Record<ProductType, ProductApiEndpoints> = {
  DOG_COLLAR: {
    productVariants: '/product/variants/8969048817879',
    leashVariants: '/product/dog-leases/8870433947863',
    buckles: '/buckle',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
  BANDANA: {
    productVariants: '/product/dog-bandanas/9022848696535',
    buckles: '/buckle',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
  CAT_COLLAR: {
    productVariants: '/product/cat-collar/454325797079',
    buckles: '/cat-buckle',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
  MARTINGALE: {
    productVariants: '/product/martingale/8975172141271',
    buckles: '/buckle',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
  LEASH: {
    productVariants: '/product/dog-leases/8870433947863',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
  HARNESS: {
    productVariants: '/product/collar/9116181463255',
    buckles: '/harness-buckle',
    engravingFonts: '/engraving-fonts',
    collections: '/shopify-collection/',
    patternById: '/product',
  },
};

// Backward-compat alias for old imports.
export const apiPoints = apiEndPointMap;
