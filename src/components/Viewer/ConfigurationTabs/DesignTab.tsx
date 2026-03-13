import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { SearchIcon } from '../../icons/Icons';
import { CollectionSidebar } from './DesignTab/CollectionSidebar';
import { PatternGrid } from './DesignTab/PatternGrid';
import { SelectedCollectionChips } from './DesignTab/SelectedCollectionChips';
import { usePatternLoader } from './DesignTab/usePatternLoader';
import { useSearchPatterns } from './DesignTab/useSearchPatterns';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const productType = 'DOG_COLLAR';

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

  const { loading: searchLoading, error: searchError } = useSearchPatterns(
    searchQuery,
    selectedCollectionIds,
    textureManager,
    productType,
  );

  const displayedPatterns = searchQuery.trim()
    ? (textureManager.searchPatterns ?? [])
    : patterns;

  const isLoading = loading || searchLoading;
  const displayError = error || searchError;

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
            className={`relative ${isMobileSearchOpen ? 'block' : 'hidden'} md:block`}>
            <input
              id="pattern-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-primary bg-white px-10 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-[#5f9f95]"
            />

            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search">
                ✕
              </button>
            )}
          </div>
          <SelectedCollectionChips
            selectedCollections={selectedCollections}
            onRemoveCollection={(collectionId) =>
              textureManager.removeSelectedCollection(collectionId)
            }
          />
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500">
            {searchLoading ? 'Searching...' : 'Loading designs...'}
          </p>
        ) : null}
        {displayError ? (
          <p className="text-sm text-red-500">{displayError}</p>
        ) : null}
        {!isLoading && !displayError && displayedPatterns.length === 0 ? (
          <p className="text-sm text-gray-500">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'No designs found.'}
          </p>
        ) : null}
        {!isLoading && !displayError ? (
          <PatternGrid
            patterns={displayedPatterns}
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
