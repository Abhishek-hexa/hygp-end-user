import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { Features } from '../../state/product/types';
import { CartIcon } from '../icons/Icons';
import { FeatureContentRenderer } from './ConfigurationPanel/FeatureContentRenderer';
import { FeatureTabsHeader } from './ConfigurationPanel/FeatureTabsHeader';

export const ConfigurationPanel = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const uiManager = mainContext.uiManager;
  const sizeManager = productManager.sizeManager;
  const features = productManager.getAllFeatures();
  const activeFeature = productManager.activeFeature;
  const selectedSize = sizeManager.selectedSizeData;
  const selectedSizePrice = selectedSize ? selectedSize.price : null;
  const addToCartPrice = selectedSizePrice ?? '44.98';

  useEffect(() => {
    if (!features.length) {
      productManager.setActiveFeature(null);
      return;
    }

    if (!activeFeature || !features.includes(activeFeature)) {
      productManager.setActiveFeature(features[0]);
    }
  }, [activeFeature, features, productManager]);

  const handleAddToBundle = () => {
    const serializedConfiguration = productManager.serializeConfiguration();
    mainContext.designManager.productStore.addProduct(serializedConfiguration);
  };

  const handleReviewBundle = () => {
    const reviewFeature = (['FETCH', 'MEOW'] as Features[]).find((feature) =>
      features.includes(feature),
    );
    if (reviewFeature) {
      productManager.setActiveFeature(reviewFeature);
    }
  };

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col text-primary">
      <FeatureTabsHeader
        features={features}
        activeFeature={activeFeature}
        onSelectFeature={(feature) => productManager.setActiveFeature(feature)}
        scrollToStartSignal={mainContext.designManager.scrollToStartSignal}
      />
      <div className="min-h-0 flex-1 overflow-y-auto">
        <FeatureContentRenderer activeFeature={activeFeature} />
      </div>
      <div className="hidden border-t border-green bg-white lg:block lg:px-12 lg:py-4">
        {uiManager.isBulkMode ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAddToBundle}
              className="flex h-10 flex-1 items-center justify-center rounded-full border-primary-orange border px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-primary-orange transition-opacity hover:opacity-95">
              <span>Add to Bundle</span>
            </button>
            <button
              type="button"
              onClick={handleReviewBundle}
              className="flex h-10 flex-1 items-center justify-center rounded-full border border-primary-orange bg-primary-orange px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-white transition-opacity hover:opacity-95">
              <span className="flex gap-2 justify-center items-center">
                <CartIcon stroke={'#fff'} />
                Review Bundle
              </span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="flex p-4 w-full items-center justify-center gap-1.5 rounded-full bg-primary-orange px-4 font-ranchers text-sm font-normal uppercase tracking-[0.8px] text-white transition-opacity hover:opacity-95">
            <CartIcon stroke={'#fff'} />
            <p className="text-[22px]">Add to Cart - ${addToCartPrice} </p>
          </button>
        )}
      </div>
    </aside>
  );
});
