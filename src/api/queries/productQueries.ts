import { useQuery } from '@tanstack/react-query';

import { ProductId } from '../../state/product/types';
import { productService } from '../services/productService';

export const useProductVariantsQuery = (productId: ProductId) =>
  useQuery({
    queryFn: () => productService.getProductVariants(productId),
    queryKey: ['product-variants', productId],
  });

export const useBuckleOptionsQuery = (productId: ProductId, enabled = true) =>
  useQuery({
    enabled,
    queryFn: () => productService.getBuckleOptions(productId),
    queryKey: ['buckle-options', productId],
  });

export const useEngravingFontsQuery = (isAdmin = false) =>
  useQuery({
    queryFn: () => productService.getEngravingFonts(isAdmin),
    queryKey: ['engraving-fonts', isAdmin],
  });

export const useCollectionsQuery = () =>
  useQuery({
    queryFn: () => productService.getCollections(),
    queryKey: ['collections'],
  });

export const usePatternsQuery = (webbingId: string) =>
  useQuery({
    enabled: !!webbingId,
    queryFn: () => productService.getPatterns(webbingId),
    queryKey: ['patterns', webbingId],
  });
