import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { SearchIcon } from '../../icons/Icons';
import { CollectionSidebar } from './DesignTab/CollectionSidebar';
import { PatternGrid } from './DesignTab/PatternGrid';
import { SelectedCollectionChips } from './DesignTab/SelectedCollectionChips';
import { usePatternLoader } from './DesignTab/usePatternLoader';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const collections = Array.from(textureManager.availableCollections.values());
  const selectedCollectionIds = textureManager.selectedCollectionIds;
  const selectedCollections = textureManager.selectedCollections;
  const patterns = textureManager.availablePatterns ?? [];
  const [searchQuery, setSearchQuery] = useState('');
  const { clearError, error, loading } = usePatternLoader(
    selectedCollectionIds,
    textureManager,
  );

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
      <CollectionSidebar
        collections={collections}
        selectedCollectionIds={selectedCollectionIds}
        onToggleCollection={(collectionId) => {
          textureManager.toggleSelectedCollection(collectionId);
          clearError();
        }}
      />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1 py-2">
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
              className="w-full rounded-full border border-primary bg-white px-10 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-[#5f9f95]"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <SelectedCollectionChips
            selectedCollections={selectedCollections}
            onRemoveCollection={(collectionId) =>
              textureManager.removeSelectedCollection(collectionId)
            }
          />
        </div>

        {loading ? (
          <p className="text-sm text-gray-500">Loading designs...</p>
        ) : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!loading && !error && filteredPatterns.length === 0 ? (
          <p className="text-sm text-gray-500">No designs found.</p>
        ) : null}
        {!loading && !error ? (
          <PatternGrid
            patterns={filteredPatterns}
            selectedPatternId={textureManager.selectedPatternId}
            onSelectPattern={(patternId) => textureManager.setSelectedPattern(patternId)}
          />
        ) : null}
      </div>
    </div>
  );
});
