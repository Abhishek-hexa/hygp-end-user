import { message } from 'antd';

import { Collection } from '../../../../state/product/types';
import { CancelIcon } from '../../../icons/Icons';

type MobileCategoryModalProps = {
  open: boolean;
  patternsCount: number;
  selectedCollections: Collection[];
  onClose: () => void;
  onRemoveCollection: (id: number) => void;
};

export const MobileCategoryModal = ({
  open,
  patternsCount,
  selectedCollections,
  onClose,
  onRemoveCollection,
}: MobileCategoryModalProps) => {
  if (!open) {
    return null;
  }

  const isOnlyOne = selectedCollections.length === 1;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end space-y-3.75 justify-center bg-black/20 p-4 md:hidden"
      onClick={onClose}>
      <div
        className="w-full max-w-md rounded-3xl border border-primary-dark bg-white p-4 shadow-lg"
        onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-medium text-font">Selected Categories</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-500"
            aria-label="Close selected categories">
            <CancelIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedCollections.map((collection) => (
            <button
              key={`mobile-chip-${collection.id}`}
              type="button"
              onClick={() => {
                if (isOnlyOne) {
                  message.warning('At least one collection must remain selected');
                  return;
                }

                onRemoveCollection(collection.id);
              }}
              className={`inline-flex bg-[##FAFAFA] items-center gap-2 rounded-full border-border border px-3 py-1.5 text-[14px] text-font`}>
              <span>{collection.title}</span>
              <CancelIcon className="h-3.5 w-3.5" />
            </button>
          ))}
        </div>

        <p className="mt-4 text-right text-[12px] text-gray-custom">
          Showing Total {patternsCount} Patterns
        </p>
      </div>
    </div>
  );
};
