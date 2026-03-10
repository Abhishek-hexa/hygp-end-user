import { ColorDescription } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';

type BuckleFinishSelectorProps = {
  colors: ColorDescription[];
  onSelectColor: (colorId: number) => void;
  selectedColor: number | null;
};

export const BuckleFinishSelector = ({
  colors,
  onSelectColor,
  selectedColor,
}: BuckleFinishSelectorProps) => {
  return (
    <section className="space-y-3">
      <h4 className="text-md font-semibold text-gray-400">Buckle Finish</h4>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              className={`flex h-12 w-12 items-center justify-center rounded-md border-2 ${
                isSelected ? 'border-primaryOrange' : 'border-primary'
              }`}
              style={{ backgroundColor: color.hex || '#d9d9d9' }}
              title={color.name}>
              {isSelected ? (
                <SelectedItemIcon className="h-6 w-6" version="white" />
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
};
