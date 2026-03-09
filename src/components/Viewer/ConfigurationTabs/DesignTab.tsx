import axios from 'axios';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { CancelIcon, SearchIcon, SelectedItemIcon } from '../../icons/Icons';
import { PatternType } from '../../../state/product/types';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const collections = Array.from(textureManager.availableCollections.values());
  const selectedCollectionIds = textureManager.selectedCollectionIds;
  const selectedCollections = textureManager.selectedCollections;
  const patterns = textureManager.availablePatterns ?? [];
  const [searchQuery, setSearchQuery] = useState('');
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
                id: string;
                name: string;
                dataX: string;
                png_image: string;
                preview: string;
              }>;
            }>(`${baseUrl}/shopify-collection/products/${collectionId}`);

            const nextPatterns: PatternType[] = (data.products ?? []).map(
              (product) => ({
                dataX: product.dataX,
                id: parseInt(product.id),
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

  const filteredPatterns = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return patterns;
    }

    return patterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(query),
    );
  }, [patterns, searchQuery]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 md:flex-row">
      <div className="md:w-[30%] md:max-w-[150px] md:min-w-[130px] md:overflow-y-auto md:overflow-x-hidden md:border-r md:border-gray-200 md:pr-2">
        <div className="flex gap-2 overflow-x-auto md:block md:space-y-1 md:overflow-visible">
          {collections.map((collection) => {
            const isSelected = selectedCollectionIds.includes(collection.id);

            return (
              <button
                key={collection.id}
                type="button"
                className={`group w-[90px] shrink-0 border-b bg-white p-2 text-left text-xs transition-all md:w-full relative  ${
                  isSelected
                    ? 'border-l-2  rounded-l-xl  border-l-primary text-primary'
                    : 'text-gray-600 hover:border-primary hover:bg-primary/10'
                }`}
                onClick={() => {
                  textureManager.toggleSelectedCollection(collection.id);
                  setError(null);
                }}>
                <div className="mb-2 overflow-hidden flex items-center justify-center">
                  <img
                    src={collection.image}
                    alt={collection.title}
                    className="h-8 w-8 object-cover rounded-md"
                  />
                </div>
                <span className="block truncate text-center text-[12px] font-medium">
                  {collection.title}
                </span>
                {isSelected ? (
                    <SelectedItemIcon
                      className="absolute right-1 top-1 h-4 w-4"
                    />
                  ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
        <div className="mb-3">
          <label htmlFor="pattern-search" className="sr-only">
            Search pattern
          </label>
          <div className="relative">
            <input
              id="pattern-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-[#8fb4ad] bg-white px-10 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-[#5f9f95]"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedCollections.map((collection) => (
              <button
                key={`chip-${collection.id}`}
                type="button"
                onClick={() => textureManager.removeSelectedCollection(collection.id)}
                className="inline-flex items-center gap-1 rounded-full border border-[#7fa8a0] bg-[#eaf5f3] px-3 py-1 text-xs text-[#2f6b63]"
              >
                <span>{collection.title}</span>
                <CancelIcon className="h-3 w-3" />
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading designs...</p>
        ) : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && filteredPatterns.length === 0 ? (
          <p className="text-sm text-gray-500">No designs found.</p>
        ) : null}
        {!loading && !error ? (
          <div>
            <p className="mb-2 text-right text-xs font-medium text-gray-500">
              Showing {filteredPatterns.length} result
              {filteredPatterns.length === 1 ? '' : 's'}
            </p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
              {filteredPatterns.map((pattern) => (
                <button
                  key={pattern.id}
                  type="button"
                  onClick={() => textureManager.setSelectedPattern(pattern.id)}
                  className={`group relative overflow-hidden rounded-md border transition-all ${
                    textureManager.selectedPatternId === pattern.id
                      ? 'border-[#3f8f80] ring-2 ring-[#a7d3cc]'
                      : 'border-gray-200 hover:border-[#8fb4ad]'
                  }`}>
                  <img
                    src={pattern.preview}
                    alt={pattern.name}
                    className="aspect-square w-full object-cover"
                  />
                  {textureManager.selectedPatternId === pattern.id ? (
                    <SelectedItemIcon
                      className="absolute right-1 top-1 h-4 w-4"
                      fillColor="#3f8f80"
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
});
