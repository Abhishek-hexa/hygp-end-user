import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { SelectedItemIcon } from '../../icons/Icons';
import { LazyImage } from '../../shared/LazyImage';
import { sizeLabelMap } from './shared/fetchSummary';

export const SizeTab = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const sizeEntries = Array.from(
    productManager.sizeManager.availableSizes.entries(),
  );
  const selectedSize = productManager.sizeManager.selectedSizeData;

  return (
    <div className="space-y-4 p-3 lg:space-y-6 lg:p-4">
      <div className="space-y-1">
        <h3 className="text-base font-bold text-gray-900 lg:text-lg">
          Select Collar Size
        </h3>
        <p className="text-xs text-gray-500 lg:text-sm">
          Choose the perfect fit for your furry friend
        </p>
      </div>
      <div
        className="feature-tabs-scroll -mx-1 flex gap-2 overflow-x-auto px-1 whitespace-nowrap lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0"
        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        {sizeEntries.map(([id, data]) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              productManager.sizeManager.setSelectedSizeData(data);
            }}
            className={`relative flex font-roboto min-w-32.5 shrink-0 flex-col items-start justify-center rounded-lg border border-gray-300 p-2.5 transition-colors lg:min-w-0 lg:p-3 ${
              selectedSize?.id === data.id
                ? 'border-primary-dark bg-primary-dark/10 text-primary'
                : ''
            }`}>
            <span className="text-[11px] font-semibold leading-tight whitespace-nowrap text-left text-zinc-900 lg:text-xs">
              {sizeLabelMap[id] ?? id}{' '}
            </span>
            <span className="mt-1 text-[11px] font-medium text-zinc-900 lg:text-xs">
              ${data.price}
            </span>
            {selectedSize?.id === data.id && (
              <div className="absolute right-2 top-2">
                <SelectedItemIcon />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-center border-t border-gray-200 lg:mt-8">
        <LazyImage
          src={productManager.sizeManager.selectedSizeData?.sizeImage}
          alt="Collar Measurement Guide"
          className="w-full max-w-md object-contain"
        />
      </div>
    </div>
  );
});
