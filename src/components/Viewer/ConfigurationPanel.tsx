import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { DesignManager } from '../../state/design/DesignManager';
import { FeatureContentRenderer } from './ConfigurationPanel/FeatureContentRenderer';
import { FeatureTabsHeader } from './ConfigurationPanel/FeatureTabsHeader';
import { CartIcon } from '../icons/Icons';


export const ConfigurationPanel = observer(
  () => {
    const mainContext = useMainContext();
    const designManager: DesignManager = mainContext.designManager;
    const sizeManager = designManager.productManager.sizeManager;
    const features = designManager.availableFeatures;
    const activeFeature = designManager.activeFeature;
    const selectedSize = sizeManager.selectedSize;
    const selectedSizePrice = selectedSize
      ? sizeManager.availableSizes.get(selectedSize)?.price
      : null;
    const addToCartPrice = selectedSizePrice ?? '44.98';

    useEffect(() => {
      if (!features.length) {
        designManager.setActiveFeature(null);
        return;
      }

      if (!activeFeature || !features.includes(activeFeature)) {
        designManager.setActiveFeature(features[0]);
      }
    }, [activeFeature, designManager, features]);

    return (
      <aside className="flex h-full min-h-0 min-w-0 flex-col text-primary">
        <FeatureTabsHeader
          features={features}
          activeFeature={activeFeature}
          onSelectFeature={(feature) => designManager.setActiveFeature(feature)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <FeatureContentRenderer activeFeature={activeFeature} />
        </div>
        <div className="border-t border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-primaryOrange px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-white transition-opacity hover:opacity-95"
          >
            <CartIcon stroke={'#fff'} />
            <span>Add to Cart - ${addToCartPrice}</span>
          </button>
        </div>
      </aside>
    );
  },
);
