import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { BuckleFinishSelector } from './BuckleTab/BuckleFinishSelector';
import { BuckleMaterialSelector } from './BuckleTab/BuckleMaterialSelector';

export const BuckleTab = observer(() => {
  const mainContext = useMainContext();
  const buckleManager = mainContext.designManager.productManager.buckleManager;
  const availableBuckleMaterials = buckleManager.availableBuckleMaterials;
  const selectedMaterial = buckleManager.material;
  const colors = buckleManager.currentColors;

  return (
    <div className="space-y-3 p-3 text-gray-700 lg:space-y-6 lg:p-4">
      <section className="space-y-1">
        <h3 className="text-base font-semibold text-gray-900 lg:text-xl">Buckle Customization</h3>
        <p className="text-xs text-gray-500 lg:text-sm">Select material and finish for hardware.</p>
      </section>

      <BuckleMaterialSelector
        availableBuckleMaterials={availableBuckleMaterials}
        selectedMaterial={selectedMaterial}
        onSelectMaterial={(type) => buckleManager.setMaterial(type)}
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
