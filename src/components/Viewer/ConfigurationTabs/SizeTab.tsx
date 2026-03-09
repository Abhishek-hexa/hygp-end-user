import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { SelectedItemIcon } from '../../icons/Icons';

const sizeLabelMap: Record<string, string> = {
  EXTRA_SMALL: 'Extra Small',
  LARGE: 'Large',
  MEDIUM: 'Medium',
  MEDIUM_NARROW: 'Medium Narrow',
  MEDIUM_WIDE: 'Medium Wide',
  SMALL: 'Small',
  XLARGE: 'XLarge',
  XXLARGE: 'XXLarge',
};

export const SizeTab = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const sizeEntries = Array.from(productManager.sizeManager.availableSizes.entries());
  const selectedSize = productManager.sizeManager.selectedSize;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900">Select Collar Size</h3>
        <p className="text-sm text-gray-500">Choose the perfect fit for your furry friend</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {sizeEntries.map(([size, description]) => (
          <button
            key={size}
            type="button"
            onClick={() => productManager.sizeManager.setSize(size)}
            className={`relative flex flex-col items-center justify-center rounded-lg border border-gray-300 p-3 transition-colors ${
              selectedSize === size
                ? 'border-primary bg-primary/10 text-primary'
                : ''
            }`}
          >
            <span className={`text-xs font-semibold leading-tight whitespace-nowrap text-left text-zinc-900`}>
              {sizeLabelMap[size] ?? size}
            </span>
            <span className={`mt-1 text-xs font-medium text-zinc-900`}>
              ${description.price}
            </span>
            {selectedSize === size && (
              <div className="absolute right-2 top-2">
                <SelectedItemIcon />
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-8 flex justify-center border-t border-gray-200">
        <img src="/size/belt 1.png" alt="Collar Measurement Guide" className="w-full max-w-md object-contain" />
      </div>
    </div>
  );
});
