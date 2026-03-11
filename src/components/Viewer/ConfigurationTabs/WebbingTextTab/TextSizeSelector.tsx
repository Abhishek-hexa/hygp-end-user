import { TextSize } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';

type TextSizeSelectorProps = {
  selectedSize: TextSize;
  sizes: Array<{ label: string; value: TextSize }>;
  onSelectSize: (size: TextSize) => void;
};

export const TextSizeSelector = ({ selectedSize, sizes, onSelectSize }: TextSizeSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
      {sizes.map((size) => {
        const isSelected = selectedSize === size.value;
        return (
          <button
            key={size.value}
            type="button"
            onClick={() => onSelectSize(size.value)}
            className={`relative w-full min-w-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors md:min-w-24 md:w-auto md:px-6 ${
              isSelected ? 'border-primary bg-primary/10 text-gray-900' : 'border-gray-200 bg-white text-gray-700'
            }`}
          >
            {size.label}
            {isSelected ? <SelectedItemIcon className="absolute right-1.5 top-1.5 h-3.5 w-3.5" /> : null}
          </button>
        );
      })}
    </div>
  );
};
