import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { PatternType } from '../../../state/product/types';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const collections = Array.from(textureManager.availableCollections.values());
  const selectedCollection = textureManager.selectedCollection;
  const patterns = textureManager.availablePatterns ?? [];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPatterns = async () => {
      if (!selectedCollection || textureManager.availablePatterns !== null) {
        return;
      }

      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { data } = await axios.get<{
          products: Array<{
            id: string;
            name: string;
            dataX: string;
            png_image: string;
            preview: string;
          }>;
        }>(
          `${baseUrl}/shopify-collection/products/${(selectedCollection.id)}`,
        );
        const nextPatterns: PatternType[] = (data.products ?? []).map(
          (product) => ({
            dataX: product.dataX,
            id: parseInt(product.id),
            name: product.name,
            pngImage: product.png_image,
            preview: product.preview,
          }),
        );
        textureManager.setAvailablePatterns(
          selectedCollection.id,
          nextPatterns,
        );
      } catch {
        setError('Could not load designs.');
      } finally {
        setLoading(false);
      }
    };

    void loadPatterns();
  }, [selectedCollection, textureManager]);

  return (
    <div className="flex h-full min-h-0 gap-4">
      <div className="w-[30%] overflow-y-auto overflow-x-hidden pr-1">
        <div className="space-y-2">
          {collections.map((collection) => (
            <button
              key={collection.id}
              type="button"
              className={`w-full rounded-xl border p-2 text-left text-xs ${
                textureManager.selectedCollectionId === collection.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-gray-300 text-gray-600'
              }`}
              onClick={() => {
                textureManager.setSelectedCollection(collection.id);
                setError(null);
              }}>
              {collection.title}
            </button>
          ))}
        </div>
      </div>

      <div className="w-[70%] overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-gray-500">Loading designs...</p>
        ) : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && patterns.length === 0 ? (
          <p className="text-sm text-gray-500">No designs found.</p>
        ) : null}
        {!loading && !error ? (
          <div className="grid grid-cols-3 gap-3">
            {patterns.map((pattern) => (
              <button
                key={pattern.id}
                type="button"
                onClick={() => textureManager.setSelectedPattern(pattern.id)}
                className={`overflow-hidden rounded-lg border ${
                  textureManager.selectedPatternId === pattern.id
                    ? 'border-primaryOrange'
                    : 'border-gray-300'
                }`}>
                <img
                  src={pattern.preview}
                  alt={pattern.name}
                  className="h-24 w-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
});
