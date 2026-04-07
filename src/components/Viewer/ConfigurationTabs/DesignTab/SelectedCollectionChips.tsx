import { message } from 'antd';

import { Collection } from '../../../../state/product/types';
import { CancelIcon } from '../../../icons/Icons';

type SelectedCollectionChipsProps = {
  onRemoveCollection: (id: number) => void;
  selectedCollections: Collection[];
};

export const SelectedCollectionChips = ({
  onRemoveCollection,
  selectedCollections,
}: SelectedCollectionChipsProps) => {
  const isOnlyOne = selectedCollections.length === 1;
  return (
    <div className="mt-2 hidden gap-2 md:flex md:overflow-auto no-scroll flex-wrap">
      {selectedCollections.map((collection) => (
        <button
          key={`chip-${collection.id}`}
          type="button"
          onClick={() => {
            if (isOnlyOne) {
              message.warning('At least one collection must remain selected');
              return;
            }

            onRemoveCollection(collection.id);
          }}
          className={`inline-flex items-center justify-center gap-1 rounded-full border border-gray-200 px-3 py-1 text-xs ${
            isOnlyOne
              ? 'bg-gray-100 text-gray-400'
              : 'bg-gray-100 text-black hover:bg-gray-200'
          }`}
          title={isOnlyOne ? 'At least one collection is required' : ''}>
          <span className="font-roboto font-normal">{collection.title}</span>
          <CancelIcon className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
};
