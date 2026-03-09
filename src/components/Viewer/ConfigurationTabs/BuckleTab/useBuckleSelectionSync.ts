import { useEffect } from 'react';

import { BuckleManager } from '../../../../state/product/managers/BuckleManager';

export const useBuckleSelectionSync = (buckleManager: BuckleManager) => {
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
      (color) => color.id === buckleManager.selectedColor,
    );

    if (!hasSelectedColor) {
      const nextColor = colors[0]?.id;
      if (nextColor) {
        buckleManager.setSelectedColor(nextColor);
      }
    }
  }, [availableBuckles, buckleManager, colors, selectedType]);
};
