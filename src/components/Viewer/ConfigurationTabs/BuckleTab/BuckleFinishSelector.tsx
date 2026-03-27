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
    <section className="space-y-3 mb-6">
      <h4 className="text-sm font-semibold text-innerTitle lg:text-base pt-6">
        Buckle Finish
      </h4>
      <div className="feature-tabs-scroll flex flex-nowrap overflow-x-auto lg:flex-wrap gap-4">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              className={`flex h-13 w-13 shrink-0 items-center justify-center rounded-md  transition-all duration-150 ease-in-out ${
                isSelected
                  ? 'border-pink border-2'
                  : 'border border-primary-dark'
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
