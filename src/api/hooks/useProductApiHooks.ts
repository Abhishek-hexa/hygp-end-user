import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { ProductType } from '../../state/product/types';
import { apiEndPointMap } from '../ApiEndPointMap';
import {
  BucklesApiResponse,
  CollectionProductsApiResponse,
  EngravingFontsApiResponse,
  LeashVariantsApiResponse,
  ProductByIdApiResponse,
  ProductVariantsApiResponse,
  SearchPatternsApiResponse,
  ShopifyCollectionsApiResponse,
} from '../types/api.types';


const getBaseUrl = () =>
  String(import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

const fetchJson = async <T>(path: string): Promise<T> => {
  if (!path) throw new Error('Path is required');
  const baseUrl = getBaseUrl();
  const { data } = await axios.get<T>(`${baseUrl}${path}`);
  return data;
};

// 1. Product Variants
export const useProductVariantsQuery = (productType: ProductType) => {
  return useQuery({
    queryFn: () =>
      fetchJson<ProductVariantsApiResponse>(
        apiEndPointMap[productType].productVariants,
      ),
    queryKey: ['productVariants', productType],
    staleTime: Infinity,
  });
};

// 2. Buckles (Not all products have buckles, so we must handle conditionally or just check if endpoint exists)
export const useBucklesQuery = (productType: ProductType) => {
  const path = apiEndPointMap[productType].buckles;
  return useQuery({
    enabled: !!path || productType === ProductType.LEASH,
    queryFn: () => fetchJson<BucklesApiResponse>(path || '/buckle'),
    queryKey: ['buckles', productType],
    staleTime: Infinity, // fallback to /buckle if undefined? Originally it was: endPoints.buckles ?? '/buckle'
  });
};

// 3. Engraving Fonts
export const useEngravingFontsQuery = (productType: ProductType) => {
  return useQuery({
    queryFn: () =>
      fetchJson<EngravingFontsApiResponse>(
        apiEndPointMap[productType].engravingFonts,
      ),
    queryKey: ['engravingFonts'],
    staleTime: Infinity,
  });
};

// 4. Collections
export const useCollectionsQuery = (productType: ProductType) => {
  return useQuery({
    queryFn: () =>
      fetchJson<ShopifyCollectionsApiResponse>(
        apiEndPointMap[productType].collections,
      ),
    queryKey: ['collections', productType],
    staleTime: Infinity,
  });
};

// 5. Leash Variants (Only for DOG_COLLAR)
export const useLeashVariantsQuery = (productType: ProductType) => {
  const path = apiEndPointMap[productType].leashVariants;
  return useQuery({
    enabled: productType === ProductType.DOG_COLLAR && !!path,
    queryFn: () => fetchJson<LeashVariantsApiResponse>(path!),
    queryKey: ['leashVariants', productType],
    staleTime: Infinity,
  });
};

// 6. Pattern By ID
export const usePatternByIdQuery = (patternId: number | null) => {
  return useQuery({
    enabled: typeof patternId === 'number' && Number.isFinite(patternId),
    queryFn: () => fetchJson<ProductByIdApiResponse>(`/product/${patternId}`),
    queryKey: ['patternById', patternId],
    retry: false,
    staleTime: Infinity, // If the pattern ID is invalid, don't keep retrying. It will just fallback in the orchestrator.
  });
};

// 7. Collection Products
export const useCollectionProductsQuery = (collectionId: string | null) => {
  return useQuery({
    enabled: !!collectionId,
    queryFn: () =>
      fetchJson<CollectionProductsApiResponse>(
        `/shopify-collection/products/${collectionId}`,
      ),
    queryKey: ['collectionProducts', collectionId],
    staleTime: Infinity,
  });
};

// 8. Search Patterns
export const useSearchPatternsQuery = (
  productType: ProductType,
  search: string,
  collectionIds?: number[],
) => {
  const path = apiEndPointMap[productType].search;
  const trimmed = search.trim();

  return useQuery({
    queryKey: ['searchPatterns', productType, trimmed],
    queryFn: async () => {
      const queryParts: string[] = [];
      // if (collectionIds && collectionIds.length > 0) {
      //   queryParts.push(`collectionId=${collectionIds.join(',')}`);
      // }
      queryParts.push(`search=${encodeURIComponent(trimmed)}`);
      return fetchJson<SearchPatternsApiResponse>(`${path}?${queryParts.join('&')}`);
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 10,
    enabled: trimmed.length > 0,
  });
};

