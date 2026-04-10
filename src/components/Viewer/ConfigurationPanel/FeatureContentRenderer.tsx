import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { Feature, ProductType } from '../../../state/product/types';
import { BuckleTab } from '../ConfigurationTabs/BuckleTab';
import { BulkFetchTab } from '../ConfigurationTabs/BulkFetchTab';
import { DesignTab } from '../ConfigurationTabs/DesignTab';
import { EngravingTab } from '../ConfigurationTabs/EngravingTab';
import { FetchMeowTab } from '../ConfigurationTabs/FetchTab/FetchMeowTab';
import { SizeTab } from '../ConfigurationTabs/SizeTab';
import { WebbingTextTab } from '../ConfigurationTabs/WebbingTextTab';
import { ComingSoon } from '../Global/ComingSoon';
import { featureLabelMap } from './featureLabelMap';

type FeatureContentRendererProps = {
  activeFeature: Feature | null;
  features: Feature[];
  onNavigateToFeature: (feature: Feature) => void;
};

export const FeatureContentRenderer = observer(
  ({
    activeFeature,
    features,
    onNavigateToFeature,
  }: FeatureContentRendererProps) => {
    const { uiManager, designManager } = useMainContext();
    const productManager = designManager.productManager;

    // Tab that comes right after ENGRAVING (for "Keep as Plastic" navigation)
    const engravingIndex = features.indexOf(Feature.ENGRAVING);
    const nextFeatureAfterEngraving =
      engravingIndex !== -1 && engravingIndex < features.length - 1
        ? features[engravingIndex + 1]
        : null;

    if (!activeFeature) {
      return (
        <div className="text-sm text-gray-500">
          Select a feature to configure.
        </div>
      );
    }

    if (activeFeature === Feature.SIZE) return <SizeTab />;

    if (activeFeature === Feature.DESIGN) return <DesignTab />;

    if (activeFeature === Feature.COLLAR_TEXT) {
      const isComingSoon =
        productManager.productId === ProductType.BANDANA ||
        productManager.productId === ProductType.HARNESS;
      return isComingSoon ? (
        <ComingSoon label="Collar Text" />
      ) : (
        <WebbingTextTab target="collar" />
      );
    }

    if (activeFeature === Feature.LEASH_TEXT)
      return <WebbingTextTab target="leash" />;

    if (activeFeature === Feature.HARNESS_TEXT) {
      const isComingSoon =
        productManager.productId === ProductType.BANDANA ||
        productManager.productId === ProductType.HARNESS;
      return isComingSoon ? (
        <ComingSoon label="Harness Text" />
      ) : (
        <WebbingTextTab target="harness" />
      );
    }

    if (activeFeature === Feature.ENGRAVING) {
      return (
        <EngravingTab
          onNavigateToFeature={onNavigateToFeature}
          nextFeatureAfterEngraving={nextFeatureAfterEngraving}
        />
      );
    }

    if (
      activeFeature === Feature.BUCKLE ||
      activeFeature === Feature.HARDWARE
    ) {
      return <BuckleTab />;
    }

    if (activeFeature === Feature.FETCH || activeFeature === Feature.MEOW) {
      if (uiManager.isBulkMode) return <BulkFetchTab feature={activeFeature} />;
      return <FetchMeowTab feature={activeFeature} />;
    }

    return (
      <div className="text-sm text-gray-500">
        {featureLabelMap[activeFeature]} configuration coming soon.
      </div>
    );
  },
);
