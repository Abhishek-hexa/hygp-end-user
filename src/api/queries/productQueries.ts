import {
  queryOptions,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { ProductId } from '../../state/product/types';
import { queryKeys } from '../queryKeys';
import { productService } from '../services/productService';
import {
  ApiBuckleOption,
  ApiCollection,
  ApiFontOption,
  ApiPattern,
  ProductVariantsResponse,
} from '../types';

type ProductVariantsQueryKey = ReturnType<typeof queryKeys.productVariants>;
type ProductVariantsQueryOptions = Omit<
  UseQueryOptions<
    ProductVariantsResponse,
    Error,
    ProductVariantsResponse,
    ProductVariantsQueryKey
  >,
  'queryFn' | 'queryKey'
>;

export const productVariantsQueryOptions = (productId: ProductId) =>
  queryOptions({
    queryFn: () => productService.getProductVariants(productId),
    queryKey: queryKeys.productVariants(productId),
  });

export const useProductVariantsQuery = (
  productId: ProductId,
  options?: ProductVariantsQueryOptions,
): UseQueryResult<ProductVariantsResponse, Error> =>
  useQuery({
    ...productVariantsQueryOptions(productId),
    ...options,
  });

export const useBuckleOptionsQuery = (
  productId: ProductId,
  options?: Omit<
    UseQueryOptions<ApiBuckleOption[], Error>,
    'queryFn' | 'queryKey'
  >,
): UseQueryResult<ApiBuckleOption[], Error> =>
  useQuery({
    queryFn: () => productService.getBuckleOptions(productId),
    queryKey: queryKeys.buckleOptions(productId),
    ...options,
  });

export const useEngravingFontsQuery = (
  isAdmin = false,
  options?: Omit<
    UseQueryOptions<ApiFontOption[], Error>,
    'queryFn' | 'queryKey'
  >,
): UseQueryResult<ApiFontOption[], Error> =>
  useQuery({
    queryFn: () => productService.getEngravingFonts(isAdmin),
    queryKey: queryKeys.engravingFonts(isAdmin),
    ...options,
  });

export const useCollectionsQuery = (
  options?: Omit<
    UseQueryOptions<ApiCollection[], Error>,
    'queryFn' | 'queryKey'
  >,
): UseQueryResult<ApiCollection[], Error> =>
  useQuery({
    queryFn: () => productService.getCollections(),
    queryKey: queryKeys.collections,
    ...options,
  });

export const usePatternsQuery = (
  webbingId: string,
  options?: Omit<UseQueryOptions<ApiPattern[], Error>, 'queryFn' | 'queryKey'>,
): UseQueryResult<ApiPattern[], Error> =>
  useQuery({
    queryFn: () => productService.getPatterns(webbingId),
    queryKey: queryKeys.patterns(webbingId),
    ...options,
  });
