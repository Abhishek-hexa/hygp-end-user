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
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
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
    <div className="flex h-full min-h-0 flex-col gap-2 md:flex-row md:gap-3">
      <CollectionSidebar
        collections={collections}
        selectedCollectionIds={selectedCollectionIds}
        onToggleCollection={(collectionId) => {
          textureManager.toggleSelectedCollection(collectionId);
          clearError();
        }}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto py-1 pr-1 md:py-2">
        <div className="mb-2 md:mb-3">
          <label htmlFor="pattern-search" className="sr-only">
            Search pattern
          </label>
          <div
            className={`relative ${isMobileSearchOpen ? ' block' : 'hidden'} md:block`}>
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
            onSelectPattern={(patternId) =>
              textureManager.setSelectedPattern(patternId)
            }
          />
        ) : null}
        <button
          type="button"
          onClick={() => setIsMobileSearchOpen((prev) => !prev)}
          className="absolute bottom-3 right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-[#f2f5f4] text-primary shadow-sm md:hidden"
          aria-label="Toggle search">
          <SearchIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
});
