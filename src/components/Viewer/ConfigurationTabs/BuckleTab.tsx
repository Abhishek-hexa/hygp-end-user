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
    <div className="space-y-6 text-gray-700 p-4">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">
          Buckle Customization
        </h3>
        <p className="text-sm text-gray-500">
          Select material and finish for hardware.
        </p>
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
