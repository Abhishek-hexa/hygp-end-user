import { useRef } from 'react';

import { ConfigFeature } from '../../../state/design/DesignManager';
import { LeftArrowIcon, RightArrowIcon } from '../../icons/Icons';
import { FeatureTabButton } from './FeatureTabButton';

type FeatureTabsHeaderProps = {
  activeFeature: ConfigFeature | null;
  features: ConfigFeature[];
  onSelectFeature: (feature: ConfigFeature) => void;
};

export const FeatureTabsHeader = ({
  activeFeature,
  features,
  onSelectFeature,
}: FeatureTabsHeaderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-[80px] items-center gap-3 border-b border-gray-300 bg-white px-6">
      <button
        type="button"
        onClick={scrollLeft}
        className="text-primaryOrange/50 transition-colors hover:text-primaryOrange">
        <LeftArrowIcon />
      </button>
      <div
        ref={scrollRef}
        className="feature-tabs-scroll flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {features.map((feature) => (
          <FeatureTabButton
            key={feature}
            feature={feature}
            activeFeature={activeFeature}
            onClick={onSelectFeature}
          />
        ))}
      </div>
      <button
        type="button"
        onClick={scrollRight}
        className="text-primaryOrange/50 transition-colors hover:text-primaryOrange">
        <RightArrowIcon />
      </button>
    </div>
  );
};
