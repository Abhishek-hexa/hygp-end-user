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
  return (
    <div className="mt-2 hidden flex-wrap gap-2 md:flex">
      {selectedCollections.map((collection) => (
        <button
          key={`chip-${collection.id}`}
          type="button"
          onClick={() => onRemoveCollection(collection.id)}
          className="inline-flex items-center justify-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs text-black">
          <span className="font-roboto font-normal">{collection.title}</span>
          <CancelIcon className="h-3 w-3" />
        </button>
      ))}
    </div>
  );
};
