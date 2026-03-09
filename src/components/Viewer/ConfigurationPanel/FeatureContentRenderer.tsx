import { ConfigFeature } from '../../../state/design/DesignManager';
import { BuckleTab } from '../ConfigurationTabs/BuckleTab';
import { CollarTextTab } from '../ConfigurationTabs/CollarTextTab';
import { DesignTab } from '../ConfigurationTabs/DesignTab';
import { EngravingTab } from '../ConfigurationTabs/EngravingTab';
import { HardwareTab } from '../ConfigurationTabs/HardwareTab';
import { HarnessTextTab } from '../ConfigurationTabs/HarnessTextTab';
import { SizeTab } from '../ConfigurationTabs/SizeTab';
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
    return <CollarTextTab />;
  }
  if (activeFeature === 'HARNESS_TEXT') {
    return <HarnessTextTab />;
  }
  if (activeFeature === 'ENGRAVING') {
    return <EngravingTab />;
  }
  if (activeFeature === 'BUCKLE') {
    return <BuckleTab />;
  }
  if (activeFeature === 'HARDWARE') {
    return <HardwareTab />;
  }

  return (
    <div className="text-sm text-gray-500">
      {featureLabelMap[activeFeature]} configuration coming soon.
    </div>
  );
};
