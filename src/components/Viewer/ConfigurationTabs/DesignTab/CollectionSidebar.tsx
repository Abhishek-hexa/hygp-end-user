import { message } from 'antd';

import { Collection } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';
import { LazyImage } from '../../../shared/LazyImage';

type CollectionSidebarProps = {
  collections: Collection[];
  onToggleCollection: (id: number) => void;
  selectedCollectionIds: number[];
};

export const CollectionSidebar = ({
  collections,
  onToggleCollection,
  selectedCollectionIds,
}: CollectionSidebarProps) => {
  return (
    <div className="md:w-[30%] max-w-full md:min-w-32.5 md:overflow-y-auto md:overflow-x-hidden md:border-r md:border-gray-200">
      <div className="feature-tabs-scroll flex overflow-x-auto md:block md:space-y-1 md:overflow-visible">
        {collections.map((collection) => {
          const isSelected = selectedCollectionIds.includes(collection.id);

          return (
            <button
              key={collection.id}
              type="button"
              className={`mb-0 border border-gray-200 group relative w-19.5 shrink-0 border-b bg-white py-2.5 text-left text-[11px] transition-all md:w-full md:border-b-0 md:py-3.5 md:text-xs ${
                isSelected
                  ? 'border-b-2 border-b-primary bg-selected text-primary-dark md:rounded-l-md md:border-l-2 md:border-l-primary-dark'
                  : 'hover:bg-primary/10'
              }`}
              onClick={() => {
                const isOnlyOne = selectedCollectionIds.length - 1 === 0;
                if (isOnlyOne && isSelected) {
                  message.warning(
                    'At least one collection must remain selected',
                  );
                  return;
                }
                onToggleCollection(collection.id);
              }}>
              <div className="mb-1.5 flex items-center justify-center overflow-hidden md:mb-2">
                <LazyImage
                  src={collection.image}
                  alt={collection.title}
                  className="h-6 w-6 rounded-md object-cover md:h-7 md:w-7"
                />
              </div>
              <span
                className={`block truncate text-center text-xs font-semibold md:text-[14px] text-gray-custom ${isSelected ? 'text-primary-dark' : ''}`}>
                {collection.title}
              </span>
              {isSelected ? (
                <SelectedItemIcon className="absolute right-1 top-1 h-3.75 w-3.75 z-10" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
