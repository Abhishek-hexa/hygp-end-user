import { observer } from 'mobx-react-lite';
import { useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMainContext } from '../../../hooks/useMainContext';
import { buildPatternPath } from '../../../state/product/productRouting';
import { CategoryIcon, SearchIcon } from '../../icons/Icons';
import { CollectionSidebar } from './DesignTab/CollectionSidebar';
import { MobileCategoryModal } from './DesignTab/MobileCategoryModal';
import { PatternGrid } from './DesignTab/PatternGrid';
import { SelectedCollectionChips } from './DesignTab/SelectedCollectionChips';
import { usePatternLoader } from './DesignTab/usePatternLoader';

export const DesignTab = observer(() => {
  const { designManager, uiManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const navigate = useNavigate();
  const { productSlug } = useParams<{ productSlug: string }>();
  const collections = Array.from(textureManager.availableCollections.values());
  const selectedCollectionIds = textureManager.selectedCollectionIds;
  const selectedCollections = textureManager.selectedCollections;
  const patterns = textureManager.availablePatterns;
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const { clearError, error, loading } = usePatternLoader(
    selectedCollectionIds,
    textureManager,
  );

  const filteredPatterns = useMemo(() => {
    const availablePatterns = patterns ?? [];
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return availablePatterns;
    }

    return availablePatterns.filter((pattern) =>
      pattern.name.toLowerCase().includes(query),
    );
  }, [patterns, searchQuery]);
  const lastVisiblePatternsRef = useRef(filteredPatterns);

  if (!loading && filteredPatterns.length > 0) {
    lastVisiblePatternsRef.current = filteredPatterns;
  }

  const visiblePatterns =
    filteredPatterns.length > 0 ? filteredPatterns : lastVisiblePatternsRef.current;
  const loadingSkeletonItems = Array.from({ length: 10 }, (_, index) => index);

  return (
    <div className="relative flex h-full min-h-0 flex-col md:flex-row md:gap-2">
      <div
        className={`relative z-20 bg-white px-4 ${
          isMobileSearchOpen ? 'p-4' : 'pt-0'
        } md:hidden`}>
        <label htmlFor="pattern-search-mobile" className="sr-only">
          Search pattern
        </label>
        <div
          className={`z-20 ${isMobileSearchOpen ? 'flex items-center gap-2' : 'hidden'}`}>
          <div className="relative flex-1">
            <input
              id="pattern-search-mobile"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="h-11 w-full rounded-full border border-primary-dark bg-white px-10 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          <button
            type="button"
            onClick={() => setIsMobileCategoryOpen(true)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-dark text-gray-500"
            aria-label="Show selected categories">
            <CategoryIcon />
          </button>
        </div>
      </div>

      <CollectionSidebar
        collections={collections}
        selectedCollectionIds={selectedCollectionIds}
        onToggleCollection={(collectionId) => {
          textureManager.toggleSelectedCollection(collectionId);
          clearError();
        }}
      />

      <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="md:p-4 md:border-border md:border-b">
          <label htmlFor="pattern-search" className="sr-only">
            Search pattern
          </label>
          <div className="relative hidden md:block ">
            <input
              id="pattern-search"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search"
              className="w-full rounded-full border border-primary-dark bg-white px-10 py-2 text-sm text-gray-700 outline-none ring-0 placeholder:text-gray-400 focus:border-[#5f9f95]"
            />
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-gray-500" />
          </div>
          <SelectedCollectionChips
            selectedCollections={selectedCollections}
            onRemoveCollection={(collectionId) =>
              textureManager.removeSelectedCollection(collectionId)
            }
          />
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        {!error && visiblePatterns.length > 0 ? (
          <PatternGrid
            patterns={visiblePatterns}
            selectedPatternId={textureManager.selectedPatternId}
            onSelectPattern={(patternId) => {
              textureManager.setSelectedPattern(patternId);
              if (!productSlug) {
                return;
              }
              navigate(
                buildPatternPath(productSlug, patternId, uiManager.isBulkMode),
              );
            }}
          />
        ) : null}
        {loading ? (
          <div className="p-4 md:p-2 md:px-4">
            <div className="grid grid-cols-5 gap-4 sm:grid-cols-4 lg:grid-cols-5">
              {loadingSkeletonItems.map((item) => (
                <div
                  key={`pattern-skeleton-${item}`}
                  className="skeleton-image aspect-square w-full rounded-md border border-gray-pattern"
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>
        ) : null}
        {!loading && !error && filteredPatterns.length === 0 ? (
          <p className="text-sm text-gray-500">No designs found.</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => setIsMobileSearchOpen((prev) => !prev)}
        className="absolute bottom-3 right-2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 bg-[#f2f5f4] text-primary shadow-sm md:hidden"
        aria-label="Toggle search">
        <SearchIcon className="h-5 w-5" />
      </button>

      <MobileCategoryModal
        open={isMobileCategoryOpen}
        selectedCollections={selectedCollections}
        patternsCount={patterns?.length ?? 0}
        onClose={() => setIsMobileCategoryOpen(false)}
        onRemoveCollection={(collectionId) =>
          textureManager.removeSelectedCollection(collectionId)
        }
      />
    </div>
  );
});
