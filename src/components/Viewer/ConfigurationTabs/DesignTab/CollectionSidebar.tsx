import { Collection } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';

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
    <div className="md:w-[30%] md:max-w-[150px] md:min-w-[130px] md:overflow-y-auto md:overflow-x-hidden md:border-r md:border-gray-200 md:pr-2">
      <div className="flex gap-2 overflow-x-auto md:block md:space-y-1 md:overflow-visible">
        {collections.map((collection) => {
          const isSelected = selectedCollectionIds.includes(collection.id);

          return (
            <button
              key={collection.id}
              type="button"
              className={`group relative w-[90px] shrink-0 border-b bg-white p-2 text-left text-xs transition-all md:w-full ${
                isSelected
                  ? 'rounded-l-md border-l-2 border-l-primary text-primary'
                  : 'text-gray-600 hover:border-primary hover:bg-primary/10'
              }`}
              onClick={() => onToggleCollection(collection.id)}>
              <div className="mb-2 flex items-center justify-center overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="h-8 w-8 rounded-md object-cover"
                />
              </div>
              <span className="block truncate text-center text-md font-medium">
                {collection.title}
              </span>
              {isSelected ? (
                <SelectedItemIcon className="absolute right-1 top-1 h-4 w-4" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
