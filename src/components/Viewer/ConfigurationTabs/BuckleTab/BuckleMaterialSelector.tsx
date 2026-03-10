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
    <section className="space-y-3">
      <h4 className="text-md font-semibold text-gray-400">Buckle Material</h4>
      <div className="flex flex-wrap gap-2">
        {availableBuckleMaterials.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => onSelectMaterial(type)}
            className={`relative min-w-24 rounded-lg border px-6 py-2 text-sm font-medium transition-colors ${
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
