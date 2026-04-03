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
  [ProductType.BANDANA]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/dog-bandanas/9022848696535',
  },
  [ProductType.CAT_COLLAR]: {
    buckles: '/cat-buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/cat-collar/454325797079',
  },
  [ProductType.DOG_COLLAR]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    leashVariants: '/product/dog-leases/8870433947863',
    patternById: '/product',
    productVariants: '/product/variants/8969048817879',
  },
  [ProductType.HARNESS]: {
    buckles: '/harness-buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/collar/9116181463255',
  },
  [ProductType.LEASH]: {
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/dog-leases/8870433947863',
  },
  [ProductType.MARTINGALE]: {
    buckles: '/buckle',
    collections: '/shopify-collection/',
    engravingFonts: '/engraving-fonts',
    patternById: '/product',
    productVariants: '/product/martingale/8975172141271',
  },
};

// Backward-compat alias for old imports.
export const apiPoints = apiEndPointMap;
