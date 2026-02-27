import { ProductId } from '../state/product/types';

export const queryKeys = {
  buckleOptions: (productId: ProductId) =>
    ['buckle-options', productId] as const,
  collections: ['collections'] as const,
  engravingFonts: (isAdmin: boolean) => ['engraving-fonts', isAdmin] as const,
  patterns: (webbingId: string) => ['patterns', webbingId] as const,
  productVariants: (productId: ProductId) =>
    ['product-variants', productId] as const,
};
