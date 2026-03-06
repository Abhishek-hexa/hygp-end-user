import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
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

  const materialGridClass =
    availableBuckles.length >= 3
      ? 'grid-cols-3'
      : availableBuckles.length === 2
        ? 'grid-cols-2'
        : 'grid-cols-1';

  return (
    <div className="space-y-9 text-gray-700">
      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Buckle Material</h3>
        <div
          className={`inline-grid overflow-hidden rounded-xl border border-teal-600 bg-gray-100 p-1 ${materialGridClass}`}
        >
          {availableBuckles.map(type => (
            <button
              key={type}
              type="button"
              onClick={() => setMaterial(type)}
              className={`min-w-28 px-4 py-2 text-sm font-medium ${
                selectedType === type
                  ? 'rounded-lg border border-primaryOrange bg-primaryOrange/10 text-primaryOrange'
                  : 'text-gray-600'
              }`}
            >
              {buckleLabelMap[type]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold">Buckle Finish</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map(color => {
            const isSelected = buckleManager.selectedColor === color.id;
            return (
              <button
                key={color.id}
                type="button"
                onClick={() => buckleManager.setSelectedColor(color.id)}
                className={`relative h-14 w-14 rounded-md border ${
                  isSelected ? 'border-primaryOrange bg-primaryOrange/10 text-primaryOrange' : 'border-teal-600'
                }`}
                style={{ backgroundColor: color.hex || '#d9d9d9' }}
                title={color.name}
              >
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
});
