import { TextSize } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';

type TextSizeSelectorProps = {
  selectedSize: TextSize;
  sizes: Array<{ label: string; value: TextSize }>;
  onSelectSize: (size: TextSize) => void;
};

export const TextSizeSelector = ({
  selectedSize,
  sizes,
  onSelectSize,
}: TextSizeSelectorProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap">
      {sizes.map((size) => {
        const isSelected = selectedSize === size.value;
        return (
          <button
            key={size.value}
            type="button"
            onClick={() => onSelectSize(size.value)}
            className={`relative md:w-30 min-w-0 rounded-lg border py-3 text-sm font-medium transition-colors  ${
              isSelected
                ? 'border-primary bg-selected text-black'
                : 'border-border bg-white text-font'
            }`}>
            {size.label}
            {isSelected ? (
              <SelectedItemIcon className="absolute right-1.5 top-1.5 h-3.5 w-3.5" />
            ) : null}
          </button>
        );
      })}
    </div>
  );
};
