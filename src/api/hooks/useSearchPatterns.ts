import { useEffect } from 'react';

import { TextureManager } from '../../state/product/managers/TextureManager';
import { PatternType, ProductType } from '../../state/product/types';
import { CollectionProductApiItem } from '../types/api.types';
import { useSearchPatternsQuery } from './useProductApiHooks';

// ─── Module-level Map cache ───────────────────────────────────────────────────
// Key = "productType|trimmedSearch|sortedCollectionIds"
// Bypasses react-query re-fetch if the answer is already in memory.

const patternCacheMap = new Map<string, PatternType[]>();

const buildCacheKey = (
  productType: ProductType,
  search: string,
): string => {
  return `${productType}|${search.trim()}`;
};

// ─── Parser ───────────────────────────────────────────────────────────────────

const parseProduct = (product: CollectionProductApiItem): PatternType => ({
  collectionId: Number(product.collection_Id || (product as any).collectionId) || 0,
  dataX: product.dataX,
  id: parseInt(product.id),
  name: product.name,
  pngImage: product.png_image,
  preview: product.preview,
});

// ─── Cache utilities ──────────────────────────────────────────────────────────

/** Invalidate a specific cached search result. */
export const invalidatePatternCache = (
  productType: ProductType,
  search: string,
) => {
  patternCacheMap.delete(buildCacheKey(productType, search));
};

/** Nuke the entire search cache (e.g. on logout or product-type switch). */
export const clearPatternCache = () => patternCacheMap.clear();

// ─── Types ────────────────────────────────────────────────────────────────────

interface UseSearchPatternsOptions {
  productType: ProductType;
  search: string;
  collectionIds?: number[];
  textureManager: TextureManager;
  enabled?: boolean;
}

interface UseSearchPatternsResult {
  patterns: PatternType[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useSearchPatterns = ({
  productType,
  search,
  collectionIds,
  textureManager,
  enabled = true,
}: UseSearchPatternsOptions): UseSearchPatternsResult => {
  const trimmed = search.trim();
  const isActive = enabled && trimmed.length > 0;

  // Check module-level cache before hitting react-query.
  const cacheKey = buildCacheKey(productType, trimmed);
  const cached = isActive ? patternCacheMap.get(cacheKey) : undefined;

  const query = useSearchPatternsQuery(
    productType,
    search,
    collectionIds,
  );

  // Populate Map cache on first successful fetch.
  useEffect(() => {
    if (!query.data || cached) return;
    const parsed = query.data.products.map(parseProduct);
    patternCacheMap.set(cacheKey, parsed);
  }, [query.data, cached, cacheKey]);

  // Resolve the final pattern list (cache-first).
  const resolvedPatterns = (() => {
    let patterns: PatternType[] = [];
    if (!isActive) return [];
    if (cached) patterns = cached;
    else if (query.data) patterns = query.data.products.map(parseProduct);
    else return [];

    const activeIds = new Set(collectionIds ?? []);
    if (activeIds.size > 0) {
      const selected = patterns.filter(p => activeIds.has(p.collectionId));
      const others = patterns.filter(p => !activeIds.has(p.collectionId));
      return [...selected, ...others];
    }
    
    return patterns;
  })();

  // ── Push to TextureManager ──────────────────────────────────────────────
  // When search becomes active → replace visible patterns with search results.
  // When search clears → restore collection patterns.
  useEffect(() => {
    if (!isActive) {
      textureManager.clearSearchPatterns();
      return;
    }

    if (resolvedPatterns.length > 0) {
      textureManager.setSearchPatterns(resolvedPatterns);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, resolvedPatterns.length, textureManager]);

  return {
    error: query.error as Error | null,
    isError: query.isError,
    isFetching: query.isFetching,
    isLoading: isActive && !cached && query.isLoading,
    patterns: resolvedPatterns,
  };
};
