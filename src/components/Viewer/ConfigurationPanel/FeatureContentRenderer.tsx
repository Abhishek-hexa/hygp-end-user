import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { Features } from '../../../state/product/types';
import { BuckleTab } from '../ConfigurationTabs/BuckleTab';
import { BulkFetchTab } from '../ConfigurationTabs/BulkFetchTab';
import { DesignTab } from '../ConfigurationTabs/DesignTab';
import { EngravingTab } from '../ConfigurationTabs/EngravingTab';
import { FetchMeowTab } from '../ConfigurationTabs/FetchTab/FetchMeowTab';
import { SizeTab } from '../ConfigurationTabs/SizeTab';
import { WebbingTextTab } from '../ConfigurationTabs/WebbingTextTab';
import { featureLabelMap } from './featureLabelMap';

type FeatureContentRendererProps = {
  activeFeature: Features | null;
};

export const FeatureContentRenderer = observer(
  ({ activeFeature }: FeatureContentRendererProps) => {
    const { uiManager } = useMainContext();

    if (!activeFeature) {
      return (
        <div className="text-sm text-gray-500">
          Select a feature to configure.
        </div>
      );
    }

    if (activeFeature === 'SIZE') {
      return <SizeTab />;
    }
    if (activeFeature === 'DESIGN') {
      return <DesignTab />;
    }
    if (activeFeature === 'COLLAR_TEXT') {
      return <WebbingTextTab target="collar" />;
    }
    if (activeFeature === 'LEASH_TEXT') {
      return <WebbingTextTab target="leash" />;
    }
    if (activeFeature === 'HARNESS_TEXT') {
      return <WebbingTextTab target="harness" />;
    }
    if (activeFeature === 'ENGRAVING') {
      return <EngravingTab />;
    }
    if (activeFeature === 'BUCKLE') {
      return <BuckleTab />;
    }
    if (activeFeature === 'HARDWARE') {
      return <BuckleTab />;
    }
    if (activeFeature === 'FETCH' || activeFeature === 'MEOW') {
      if (uiManager.isBulkMode) {
        return <BulkFetchTab feature={activeFeature} />;
      }
      return <FetchMeowTab feature={activeFeature} />;
    }

    return (
      <div className="text-sm text-gray-500">
        {featureLabelMap[activeFeature]} configuration coming soon.
      </div>
    );
  },
);
