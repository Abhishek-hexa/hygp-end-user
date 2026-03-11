import { ConfigFeature } from '../../../state/design/DesignManager';
import { BuckleTab } from '../ConfigurationTabs/BuckleTab';
import { DesignTab } from '../ConfigurationTabs/DesignTab';
import { EngravingTab } from '../ConfigurationTabs/EngravingTab';
import { FetchMeowTab } from '../ConfigurationTabs/FetchMeowTab';
import { SizeTab } from '../ConfigurationTabs/SizeTab';
import { WebbingTextTab } from '../ConfigurationTabs/WebbingTextTab';
import { featureLabelMap } from './featureLabelMap';

type FeatureContentRendererProps = {
  activeFeature: ConfigFeature | null;
};

export const FeatureContentRenderer = ({
  activeFeature,
}: FeatureContentRendererProps) => {
  if (!activeFeature) {
    return <div className="text-sm text-gray-500">Select a feature to configure.</div>;
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
    return <FetchMeowTab feature={activeFeature} />;
  }

  return (
    <div className="text-sm text-gray-500">
      {featureLabelMap[activeFeature]} configuration coming soon.
    </div>
  );
};
