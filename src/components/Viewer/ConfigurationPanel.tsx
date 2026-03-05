import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { ConfigFeature, DesignManager } from '../../state/design/DesignManager';
import { BuckleTab } from './ConfigurationTabs/BuckleTab';
import { CollarTextTab } from './ConfigurationTabs/CollarTextTab';
import { DesignTab } from './ConfigurationTabs/DesignTab';
import { EngravingTab } from './ConfigurationTabs/EngravingTab';
import { HarnessTextTab } from './ConfigurationTabs/HarnessTextTab';
import { HardwareTab } from './ConfigurationTabs/HardwareTab';
import { SizeTab } from './ConfigurationTabs/SizeTab';

const featureLabelMap: Record<ConfigFeature, string> = {
  BUCKLE: 'BUCKLE',
  COLLAR_TEXT: 'COLLAR TEXT',
  DESIGN: 'SELECT DESIGN',
  ENGRAVING: 'ENGRAVING',
  HARDWARE: 'HARDWARE',
  HARNESS_TEXT: 'HARNESS TEXT',
  SIZE: 'SIZE',
};

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

    const renderFeatureContent = () => {
      if (!activeFeature) {
        return (
          <div className="text-sm text-gray-500">
            Select a feature to configure.
          </div>
        );
      }

      if (activeFeature === 'SIZE') return <SizeTab />;
      if (activeFeature === 'DESIGN') return <DesignTab />;
      if (activeFeature === 'COLLAR_TEXT') return <CollarTextTab />;
      if (activeFeature === 'HARNESS_TEXT') return <HarnessTextTab />;
      if (activeFeature === 'ENGRAVING') return <EngravingTab />;
      if (activeFeature === 'BUCKLE') return <BuckleTab />;
      if (activeFeature === 'HARDWARE') return <HardwareTab />;

      return (
        <div className="text-sm text-gray-500">
          {featureLabelMap[activeFeature]} configuration coming soon.
        </div>
      );
    };

    return (
      <aside className="flex h-full min-w-0 flex-col bg-gray-100 text-gray-700">
        <div className="flex h-20 items-center gap-3 border-b border-gray-300 px-4">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap">
            {features.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => designManager.setActiveFeature(feature)}
                className={`shrink-0 rounded-full border px-5 py-2 text-md font-semibold uppercase tracking-wide ${
                  feature === activeFeature
                    ? 'border-rose-400 bg-rose-400 text-white'
                    : 'border-lime-200 bg-gray-100 text-lime-800'
                }`}
              >
                {featureLabelMap[feature]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {renderFeatureContent()}
        </div>
      </aside>
    );
  },
);
