import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { BuckleType } from '../../../state/product/types';
import { BuckleFinishSelector } from './BuckleTab/BuckleFinishSelector';
import { BuckleMaterialSelector } from './BuckleTab/BuckleMaterialSelector';
import { useBuckleSelectionSync } from './BuckleTab/useBuckleSelectionSync';

export const BuckleTab = observer(() => {
  const mainContext = useMainContext();
  const buckleManager = mainContext.designManager.productManager.buckleManager;
  const availableBuckles = buckleManager.availableBuckles;
  const selectedType = buckleManager.type;
  const colors = buckleManager.currentColors;

  useBuckleSelectionSync(buckleManager);

  const setMaterial = (type: BuckleType) => {
    buckleManager.setType(type);
    const nextColors =
      type === 'METAL'
        ? buckleManager.metalColors
        : type === 'PLASTIC'
          ? buckleManager.plasticColors
          : buckleManager.breakawayColors;

    const defaultColor = nextColors[0]?.id;
    if (defaultColor) {
      buckleManager.setSelectedColor(defaultColor);
    }
  };

  return (
    <div className="space-y-4 p-3 text-gray-700 lg:space-y-6 lg:p-4">
      <section className="space-y-1">
        <h3 className="text-lg font-semibold text-gray-900 lg:text-xl">Buckle Customization</h3>
        <p className="text-xs text-gray-500 lg:text-sm">Select material and finish for hardware.</p>
      </section>

      <BuckleMaterialSelector
        availableBuckles={availableBuckles}
        selectedType={selectedType}
        onSelectType={setMaterial}
      />

      <div className="border-t border-gray-200" />

      <BuckleFinishSelector
        colors={colors}
        selectedColor={buckleManager.selectedColor}
        onSelectColor={(colorId) => buckleManager.setSelectedColor(colorId)}
      />
    </div>
  );
});
