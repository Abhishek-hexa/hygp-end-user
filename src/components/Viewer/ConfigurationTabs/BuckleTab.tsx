import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { SelectedItemIcon } from '../../icons/Icons';
import { BuckleType } from '../../../state/product/types';

const buckleLabelMap: Record<BuckleType, string> = {
  BREAKAWAY: 'Breakaway',
  METAL: 'Metal',
  PLASTIC: 'Plastic',
};

export const BuckleTab = observer(() => {
  const mainContext = useMainContext();
  const buckleManager = mainContext.designManager.productManager.buckleManager;
  const availableBuckles = buckleManager.availableBuckles;
  const selectedType = buckleManager.type;
  const colors = buckleManager.currentColors;

  useEffect(() => {
    if (!selectedType && availableBuckles.length) {
      buckleManager.setType(availableBuckles[0]);
      return;
    }

    if (!selectedType) {
      return;
    }

    const hasSelectedColor = colors.some(
      color => color.id === buckleManager.selectedColor,
    );

    if (!hasSelectedColor) {
      const nextColor = colors[0]?.id;
      if (nextColor) {
        buckleManager.setSelectedColor(nextColor);
      }
    }
  }, [availableBuckles, buckleManager, colors, selectedType]);

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
    <div className="space-y-6 text-gray-700 p-4">
      <section className="space-y-1">
        <h3 className="text-xl font-semibold text-gray-900">Buckle Customization</h3>
        <p className="text-sm text-gray-500">Select material and finish for hardware.</p>
      </section>

      <section className="space-y-3">
        <h4 className="text-md font-semibold text-gray-400">Buckle Material</h4>
        <div className="flex flex-wrap gap-2">
          {availableBuckles.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMaterial(type)}
              className={`relative min-w-24 rounded-lg border px-6 py-2 text-sm font-medium transition-colors ${
                selectedType === type
                  ? 'border-primary bg-primary/10 text-gray-900'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              {buckleLabelMap[type]}
              {selectedType === type ? (
                <SelectedItemIcon
                  className="absolute right-1.5 top-1.5 h-3.5 w-3.5"
                  fillColor="#5b9084"
                />
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-200" />

      <section className="space-y-3">
        <h4 className="text-md font-semibold text-gray-400">Buckle Finish</h4>
        <div className="flex flex-wrap gap-3">
          {colors.map(color => {
            const isSelected = buckleManager.selectedColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => buckleManager.setSelectedColor(color.id)}
                className={`flex justify-center items-center h-12 w-12 rounded-md border-2 ${
                  isSelected
                    ? 'border-primaryOrange'
                    : 'border-primary'
                }`}
                style={{ backgroundColor: color.hex || '#d9d9d9' }}
                title={color.name}
              >
                {isSelected ? (
                  <SelectedItemIcon
                    className="h-6 w-6"
                    version='white'
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});
