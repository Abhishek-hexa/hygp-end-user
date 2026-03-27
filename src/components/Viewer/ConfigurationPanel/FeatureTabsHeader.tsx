import { useRef, useState } from 'react';

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
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setIsAtStart(container.scrollLeft <= 0);
    setIsAtEnd(
      container.scrollLeft + container.clientWidth >= container.scrollWidth - 1,
    );
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ behavior: 'smooth', left: -200 });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ behavior: 'smooth', left: 200 });
    }
  };

  const handleSelectFeature = (feature: Features) => {
    onSelectFeature(feature);

    requestAnimationFrame(() => {
      const container = scrollRef.current;
      if (!container) return;

      const tabs = container.querySelectorAll<HTMLElement>('[data-feature]');
      let el: HTMLElement | null = null;
      tabs.forEach((tab) => {
        if (tab.dataset.feature === String(feature)) el = tab;
      });

      if (!el) return;

      const containerRect = container.getBoundingClientRect();
      const elRect = (el as HTMLElement).getBoundingClientRect();

      if (
        elRect.left >= containerRect.left &&
        elRect.right <= containerRect.right
      )
        return;

      let newScrollLeft = container.scrollLeft;

      if (elRect.left < containerRect.left) {
        newScrollLeft =
          container.scrollLeft + elRect.left - containerRect.left - 8;
      } else if (elRect.right > containerRect.right) {
        newScrollLeft =
          container.scrollLeft + elRect.right - containerRect.right + 8;
      }

      const maxScroll = container.scrollWidth - container.clientWidth;

      container.scrollTo({
        behavior: 'smooth',
        left: Math.max(0, Math.min(newScrollLeft, maxScroll)),
      });
    });
  };

  return (
    <div className="flex p-3 lg:p-6 items-center gap-2 border-b border-gray-300 bg-white lg:gap-3">
      <button
        type="button"
        disabled={isAtStart}
        onClick={scrollLeft}
        className={`hidden lg:block transition-colors ${
          isAtStart
            ? 'text-primary-orange/50 opacity-50 cursor-not-allowed!'
            : 'text-primary-orange/50 hover:text-primary-orange'
        }`}>
        <LeftArrowIcon />
      </button>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="no-scroll flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {features.map((feature) => (
          <FeatureTabButton
            key={feature}
            feature={feature}
            activeFeature={activeFeature}
            onClick={handleSelectFeature}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={isAtEnd}
        onClick={scrollRight}
        className={`hidden lg:block transition-colors ${
          isAtEnd
            ? 'text-gray-300 opacity-50 cursor-not-allowed!'
            : 'text-primary-orange/50 hover:text-primary-orange'
        }`}>
        <RightArrowIcon />
      </button>
    </div>
  );
};
