import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import SectionHeader from '../Global/SectionHeader';
import { BuckleFinishSelector } from './BuckleTab/BuckleFinishSelector';
import { BuckleMaterialSelector } from './BuckleTab/BuckleMaterialSelector';

export const BuckleTab = observer(() => {
  const mainContext = useMainContext();
  const buckleManager = mainContext.designManager.productManager.buckleManager;
  const availableBuckleMaterials = buckleManager.availableBuckleMaterials;
  const selectedMaterial = buckleManager.material;
  const colors = buckleManager.currentColors;

  return (
    <div className="">
      <div className="p-4 lg:p-6">
        <SectionHeader
          title="Buckle Customization"
          subtitle={`Select ${
            availableBuckleMaterials.length > 0 ? 'material and ' : ''
          }finish for hardware.`}
        />

        {availableBuckleMaterials.length > 0 && (
          <BuckleMaterialSelector
            availableBuckleMaterials={availableBuckleMaterials}
            selectedMaterial={selectedMaterial}
            onSelectMaterial={(type) => buckleManager.setMaterial(type)}
          />
        )}

        <div className="border-t border-border-gray" />

        <BuckleFinishSelector
          colors={colors}
          selectedColor={buckleManager.selectedColor}
          onSelectColor={(colorId) => buckleManager.setSelectedColor(colorId)}
        />
      </div>
    </div>
  );
});
