import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';

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
      <h3 className="text-3xl font-semibold text-[#555]">Select Collar Size</h3>
      <div className="grid grid-cols-3 gap-3">
        {sizeEntries.map(([size, description]) => (
          <button
            key={size}
            type="button"
            onClick={() => productManager.sizeManager.setSize(size)}
            className={`relative rounded-xl border px-3 py-4 text-center ${
              selectedSize === size
                ? 'border-[#f17c7c] bg-white text-[#f04545]'
                : 'border-[#6a9d9a] bg-[#f0f0f0] text-[#4a4a4a]'
            }`}
          >

            <div className="text-lg">{sizeLabelMap[size] ?? size}</div>
            <div className="text-lg font-medium">${description.price}</div>
          </button>
        ))}
      </div>
    </div>
  );
});
