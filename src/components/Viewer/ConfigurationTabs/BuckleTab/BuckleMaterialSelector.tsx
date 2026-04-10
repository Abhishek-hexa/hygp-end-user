import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { SelectedItemIcon } from '../../../icons/Icons';
import { buckleLabelMap } from './buckleLabelMap';
import { PlasticWarningModal } from './PlasticWarningModal';

type BuckleMaterialSelectorProps = {
  onSelectMaterial: (
    type: import('../../../../state/product/types').BuckleMaterialType,
  ) => void;
};

export const BuckleMaterialSelector = observer(
  ({ onSelectMaterial }: BuckleMaterialSelectorProps) => {
    const mainContext = useMainContext();
    const buckleManager =
      mainContext.designManager.productManager.buckleManager;

    const handleSelectMaterial = (
      type: import('../../../../state/product/types').BuckleMaterialType,
    ) => {
      if (type === 'PLASTIC' && !buckleManager.hasShownPlasticWarning) {
        buckleManager.openPlasticWarningModal(); // ✅ sets flag + opens modal
        return;
      }
      onSelectMaterial(type);
    };

    const handleKeepAsMetal = () => {
      buckleManager.closePlasticWarningModal();
    };

    const handleChangeToPlastic = () => {
      buckleManager.closePlasticWarningModal();
      onSelectMaterial('PLASTIC');
    };

    return (
      <>
        <section className="space-y-3 mb-6">
          <h4 className="text-sm font-semibold text-innerTitle lg:text-base">
            Buckle Material
          </h4>
          <div className="flex flex-wrap gap-2">
            {buckleManager.availableBuckleMaterials.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => handleSelectMaterial(type)}
                className={`text-sm relative flex font-roboto text-semibold shrink-0 flex-col items-start justify-center rounded-lg border border-border p-3 transition-colors lg:min-w-0 px-11 lg:py-3 text-black ${
                  buckleManager.material === type
                    ? 'border-primary-dark bg-selected text-black'
                    : ''
                }`}>
                {buckleLabelMap[type]}
                {buckleManager.material === type ? (
                  <SelectedItemIcon className="absolute right-1.5 top-1.5 h-3.5 w-3.5" />
                ) : null}
              </button>
            ))}
          </div>
        </section>

        {buckleManager.showPlasticWarningModal && (
          <PlasticWarningModal
            onKeepAsMetal={handleKeepAsMetal}
            onChangeToPlastic={handleChangeToPlastic}
          />
        )}
      </>
    );
  },
);
