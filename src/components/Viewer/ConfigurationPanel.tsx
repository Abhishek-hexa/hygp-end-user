import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { ConfigFeature, DesignManager } from '../../state/design/DesignManager';
import { LeftArrowIcon, RightArrowIcon } from '../icons/Icons';
import { BuckleTab } from './ConfigurationTabs/BuckleTab';
import { CollarTextTab } from './ConfigurationTabs/CollarTextTab';
import { DesignTab } from './ConfigurationTabs/DesignTab';
import { EngravingTab } from './ConfigurationTabs/EngravingTab';
import { HardwareTab } from './ConfigurationTabs/HardwareTab';
import { HarnessTextTab } from './ConfigurationTabs/HarnessTextTab';
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
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
      if (scrollRef.current) scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    };

    const scrollRight = () => {
      if (scrollRef.current) scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    };

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
      <aside className="flex h-full min-h-0 min-w-0 flex-col text-primary">
        <div className="flex h-[80px] items-center gap-3 border-b border-gray-300 bg-white px-6">
          <button type="button" onClick={scrollLeft} className="text-primaryOrange/50 hover:text-primaryOrange transition-colors">
            <LeftArrowIcon />
          </button>
          <div 
            ref={scrollRef}
            className="flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap"
            style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
          >
            <style>{`.flex-1::-webkit-scrollbar { display: none; }`}</style>
            {features.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => designManager.setActiveFeature(feature)}
                className={`flex shrink-0 items-center justify-center rounded-full border-2 px-4 py-1 font-ranchers text-md font-normal tracking-[1px] transition-colors ${
                  feature === activeFeature
                    ? 'border-primaryOrange bg-primaryOrange text-white'
                    : 'border-primary bg-white text-primary hover:bg-gray-50'
                }`}
              >
                {featureLabelMap[feature]}
              </button>
            ))}
          </div>
          <button type="button" onClick={scrollRight} className="text-primaryOrange/50 hover:text-primaryOrange transition-colors">
            <RightArrowIcon />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          {renderFeatureContent()}
        </div>
      </aside>
    );
  },
);
