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
    queryKey: ['productVariants', productType],
    queryFn: () =>
      fetchJson<ProductVariantsApiResponse>(
        apiEndPointMap[productType].productVariants,
      ),
    staleTime: Infinity,
  });
};

// 2. Buckles (Not all products have buckles, so we must handle conditionally or just check if endpoint exists)
export const useBucklesQuery = (productType: ProductType) => {
  const path = apiEndPointMap[productType].buckles;
  return useQuery({
    queryKey: ['buckles', productType],
    queryFn: () => fetchJson<BucklesApiResponse>(path || '/buckle'),
    staleTime: Infinity,
    enabled: !!path || productType === 'LEASH', // fallback to /buckle if undefined? Originally it was: endPoints.buckles ?? '/buckle'
  });
};

// 3. Engraving Fonts
export const useEngravingFontsQuery = (productType: ProductType) => {
  return useQuery({
    queryKey: ['engravingFonts', productType],
    queryFn: () =>
      fetchJson<EngravingFontsApiResponse>(
        apiEndPointMap[productType].engravingFonts,
      ),
    staleTime: Infinity,
  });
};

// 4. Collections
export const useCollectionsQuery = (productType: ProductType) => {
  return useQuery({
    queryKey: ['collections', productType],
    queryFn: () =>
      fetchJson<ShopifyCollectionsApiResponse>(
        apiEndPointMap[productType].collections,
      ),
    staleTime: Infinity,
  });
};

// 5. Leash Variants (Only for DOG_COLLAR)
export const useLeashVariantsQuery = (productType: ProductType) => {
  const path = apiEndPointMap[productType].leashVariants;
  return useQuery({
    queryKey: ['leashVariants', productType],
    queryFn: () => fetchJson<LeashVariantsApiResponse>(path!),
    staleTime: Infinity,
    enabled: productType === 'DOG_COLLAR' && !!path,
  });
};

// 6. Pattern By ID
export const usePatternByIdQuery = (patternId: number | null) => {
  return useQuery({
    queryKey: ['patternById', patternId],
    queryFn: () => fetchJson<ProductByIdApiResponse>(`/product/${patternId}`),
    staleTime: Infinity,
    enabled: typeof patternId === 'number' && Number.isFinite(patternId),
    retry: false, // If the pattern ID is invalid, don't keep retrying. It will just fallback in the orchestrator.
  });
};

// 7. Collection Products
export const useCollectionProductsQuery = (collectionId: string | null) => {
  return useQuery({
    queryKey: ['collectionProducts', collectionId],
    queryFn: () =>
      fetchJson<CollectionProductsApiResponse>(
        `/shopify-collection/products/${collectionId}`,
      ),
    staleTime: Infinity,
    enabled: !!collectionId,
  });
};
