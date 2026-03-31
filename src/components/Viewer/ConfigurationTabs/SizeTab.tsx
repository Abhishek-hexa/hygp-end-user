import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { LazyImage } from '../../shared/LazyImage';
import SectionHeader from '../Global/SectionHeader';
import { SizeOptionButton } from '../Global/SizeOptionButton';
import { sizeLabelMap } from './shared/fetchSummary';

export const SizeTab = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const sizeEntries = Array.from(
    productManager.sizeManager.availableSizes.entries(),
  );
  const selectedSize = productManager.sizeManager.selectedSizeData;

  return (
    <div className="">
      <div className="p-4 lg:p-6">
        <SectionHeader
          title="Select Collar Size"
          subtitle="Choose the perfect fit for your furry friend"
        />
        <div
          className="feature-tabs-scroll -mx-1 flex gap-2 md:gap-4 overflow-x-auto px-1 whitespace-nowrap lg:mx-0 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:overflow-visible lg:px-0"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {sizeEntries.map(([id, data]) => (
            <SizeOptionButton
              key={id}
              id={id}
              label={sizeLabelMap[id] ?? id}
              price={data.price}
              isSelected={selectedSize?.id === data.id}
              onClick={() =>
                productManager.sizeManager.setSelectedSizeData(data)
              }
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center border-t border-divider p-4 lg:p-6">
        <div className="w-full max-w-md min-h-50">
          <LazyImage
            key={productManager.sizeManager.selectedSizeData?.id} // ← forces skeleton on size change
            src={productManager.sizeManager.selectedSizeData?.sizeImage}
            alt="Collar Measurement Guide"
            className="w-full max-w-md object-contain min-h-40"
          />
        </div>
      </div>
    </div>
  );
});
