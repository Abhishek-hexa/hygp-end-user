import { useEffect, useState } from 'react';

import { TextureManager } from '../../../../state/product/managers/TextureManager';
import { ProductType } from '../../../../state/product/types';
import { searchPatterns } from '../../../../api/initializeProductApis';

export const useSearchPatterns = (
  searchQuery: string,
  selectedCollectionIds: number[],
  textureManager: TextureManager,
  productType: ProductType,
) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      textureManager.clearSearchPatterns();
      setError(null);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);

      searchPatterns(
        textureManager,
        productType,
        searchQuery.trim(),
        selectedCollectionIds.length > 0 ? selectedCollectionIds : undefined, 
      )
        .catch((err: unknown) => {
          if ((err as { name?: string }).name === 'AbortError') return;
          setError(err instanceof Error ? err.message : 'Search failed');
        })
        .finally(() => setLoading(false));
    }, 400);

    return () => {
      clearTimeout(timeout);
      controller.abort(); 
    };
  }, [searchQuery, selectedCollectionIds, textureManager, productType]);

  return { loading, error };
};