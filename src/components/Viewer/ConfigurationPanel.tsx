import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { DesignManager } from '../../state/design/DesignManager';
import { FeatureContentRenderer } from './ConfigurationPanel/FeatureContentRenderer';
import { FeatureTabsHeader } from './ConfigurationPanel/FeatureTabsHeader';

export const ConfigurationPanel = observer(
  () => {
    const mainContext = useMainContext();
    const designManager: DesignManager = mainContext.designManager;
    const features = designManager.availableFeatures;
    const activeFeature = designManager.activeFeature;

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
      </aside>
    );
  },
);
