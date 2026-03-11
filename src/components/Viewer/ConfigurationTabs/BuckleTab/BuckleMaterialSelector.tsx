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
    <section className="space-y-2 lg:space-y-3">
      <h4 className="text-sm font-semibold text-gray-400 lg:text-md">Buckle Material</h4>
      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap">
        {availableBuckleMaterials.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelectMaterial(type)}
            className={`relative w-full min-w-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors md:min-w-24 md:w-auto md:px-6 ${
              selectedMaterial === type
                ? 'border-primary bg-primary/10 text-gray-900'
                : 'border-gray-200 bg-white text-gray-700'
            }`}>
            {buckleLabelMap[type]}
            {selectedMaterial === type ? (
              <SelectedItemIcon
                className="absolute right-1.5 top-1.5 h-3.5 w-3.5"
                fillColor="#5b9084"
              />
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
};
