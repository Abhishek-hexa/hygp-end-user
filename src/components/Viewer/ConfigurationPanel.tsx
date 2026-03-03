import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { ConfigFeature, DesignManager } from '../../state/design/DesignManager';
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


      return (
        <div className="text-sm text-gray-500">
          {featureLabelMap[activeFeature]} configuration coming soon.
        </div>
      );
    };

    return (
      <aside className="h-full min-w-0 bg-[#ebebeb] text-[#4a4a4a]">
        <div className="flex h-[86px] items-center gap-3 border-b border-[#d0d0d0] px-4">
          <div className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap">
            {features.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => designManager.setActiveFeature(feature)}
                className={`shrink-0 rounded-full border px-5 py-2 text-base font-semibold uppercase tracking-wide ${
                  feature === activeFeature
                    ? 'border-[#ef868a] bg-[#ef868a] text-white'
                    : 'border-[#9eb9b5] bg-[#f0f0f0] text-[#6f9a94]'
                }`}
              >
                {featureLabelMap[feature]}
              </button>
            ))}
          </div>
        </div>
        <div className="h-[calc(100%-86px)] overflow-y-auto p-6">
          {renderFeatureContent()}
        </div>
      </aside>
    );
  },
);
