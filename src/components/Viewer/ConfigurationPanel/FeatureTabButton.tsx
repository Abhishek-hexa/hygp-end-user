import { Features } from '../../../state/product/types';
import { featureLabelMap } from './featureLabelMap';

type FeatureTabButtonProps = {
  activeFeature: Features | null;
  feature: Features;
  onClick: (feature: Features) => void;
};

export const FeatureTabButton = ({
  activeFeature,
  feature,
  onClick,
}: FeatureTabButtonProps) => {
  return (
    <button
      type="button"
      onClick={() => onClick(feature)}
      className={`flex shrink-0 items-center justify-center rounded-full border-2 px-4 py-1 font-ranchers text-md font-normal tracking-[1px] transition-colors ${
        feature === activeFeature
          ? 'border-primary-orange bg-primary-orange text-white'
          : 'border-primary bg-white text-primary hover:bg-gray-50'
      }`}>
      {featureLabelMap[feature]}
    </button>
  );
};
