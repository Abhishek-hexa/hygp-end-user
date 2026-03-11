import { useRef } from 'react';

import { Features } from '../../../state/product/types';
import { LeftArrowIcon, RightArrowIcon } from '../../icons/Icons';
import { FeatureTabButton } from './FeatureTabButton';

type FeatureTabsHeaderProps = {
  activeFeature: Features | null;
  features: Features[];
  onSelectFeature: (feature: Features) => void;
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
    <div className="flex p-2 items-center gap-2 border-b border-gray-300 bg-white px-3 lg:gap-3 lg:px-6">
      <button
        type="button"
        onClick={scrollLeft}
        className="hidden text-primaryOrange/50 transition-colors hover:text-primaryOrange lg:block">
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
        className="hidden text-primaryOrange/50 transition-colors hover:text-primaryOrange lg:block">
        <RightArrowIcon />
      </button>
    </div>
  );
};
