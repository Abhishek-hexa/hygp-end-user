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
    <section className="space-y-2 lg:space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 lg:text-md">
        Buckle Finish
      </h4>
      <div className="feature-tabs-scroll flex flex-nowrap gap-2 overflow-x-auto lg:flex-wrap lg:gap-3 lg:overflow-visible">
        {colors.map((color) => {
          const isSelected = selectedColor === color.id;
          return (
            <button
              key={color.id}
              type="button"
              onClick={() => onSelectColor(color.id)}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 lg:h-12 lg:w-12 ${
                isSelected ? 'border-primary-orange' : 'border-gray-300'
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
