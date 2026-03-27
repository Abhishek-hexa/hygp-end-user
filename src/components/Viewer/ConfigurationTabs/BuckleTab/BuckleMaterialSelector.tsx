import { BuckleMaterialType } from '../../../../state/product/types';
import { SelectedItemIcon } from '../../../icons/Icons';
import { buckleLabelMap } from './buckleLabelMap';

type BuckleMaterialSelectorProps = {
  availableBuckleMaterials: BuckleMaterialType[];
  onSelectMaterial: (type: BuckleMaterialType) => void;
  selectedMaterial: BuckleMaterialType | null;
};

export const BuckleMaterialSelector = ({
  availableBuckleMaterials,
  onSelectMaterial,
  selectedMaterial,
}: BuckleMaterialSelectorProps) => {
  return (
    <section className="space-y-3 mb-6">
      <h4 className="text-sm font-semibold text-innerTitle lg:text-base">
        Buckle Material
      </h4>
      <div className="flex flex-wrap gap-2">
        {availableBuckleMaterials.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelectMaterial(type)}
            className={`text-sm relative flex font-roboto text-semibold shrink-0 flex-col items-start justify-center rounded-lg border border-border p-3 transition-colors lg:min-w-0 px-11 lg:py-3 text-black ${
              selectedMaterial === type
                ? 'border-primary-dark bg-selected text-black'
                : ''
            }`}>
            {buckleLabelMap[type]}
            {selectedMaterial === type ? (
              <SelectedItemIcon className="absolute right-1.5 top-1.5 h-3.5 w-3.5" />
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
};
