import axios from 'axios';
import { useEffect, useState } from 'react';

import { TextureManager } from '../../../../state/product/managers/TextureManager';
import { PatternType } from '../../../../state/product/types';

type UsePatternLoaderResult = {
  clearError: () => void;
  error: string | null;
  loading: boolean;
};

export const usePatternLoader = (
  selectedCollectionIds: number[],
  textureManager: TextureManager,
): UsePatternLoaderResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatterns = async () => {
      if (selectedCollectionIds.length === 0) {
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        await Promise.all(
          selectedCollectionIds.map(async (collectionId) => {
            if (textureManager.hasPatternsForCollection(collectionId)) {
              return;
            }

            const { data } = await axios.get<{
              products: Array<{
                dataX: string;
                id: string | number;
                name: string;
                collection_Id?: string | number;
                collectionId?: string | number;
                png_image: string;
                preview: string;
              }>;
            }>(`${baseUrl}/shopify-collection/products/${collectionId}`);

            const nextPatterns: PatternType[] = (data.products ?? []).map(
              (product) => ({
                collectionId:
                  Number(product.collection_Id ?? product.collectionId) ||
                  collectionId,
                dataX: product.dataX,
                id: Number(product.id),
                name: product.name,
                pngImage: product.png_image,
                preview: product.preview,
              }),
            );

            textureManager.setAvailablePatterns(collectionId, nextPatterns);
          }),
        );
      } catch {
        setError('Could not load designs.');
      } finally {
        setLoading(false);
      }
    };

    void loadPatterns();
  }, [selectedCollectionIds, textureManager]);

  return {
    clearError: () => setError(null),
    error,
    loading,
  };
};
