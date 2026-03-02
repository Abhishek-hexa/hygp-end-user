import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { toTitleCase } from '../utils';

export const SizeTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <>
      <h2 className="mb-2 text-[32px] font-bold">Select Collar Size</h2>
      <div className="grid grid-cols-2 gap-1.5">
        {productManager.size.backendVariants.map((variant) => {
          const isSelected = productManager.size.selectedSize === variant.size;
          return (
            <button
              key={variant.id}
              onClick={() => productManager.size.setSize(variant.size)}
              className="flex min-h-[72px] flex-col items-center justify-center gap-0.5 rounded-lg border text-base"
              style={{
                borderColor: isSelected ? '#EE8F90' : '#7AA79A',
                color: isSelected ? '#EE6E72' : '#4A4A4A',
              }}>
              <span>{variant.name || toTitleCase(variant.size)}</span>
              <span className="font-bold">${variant.price.toFixed(2)}</span>
            </button>
          );
        })}
      </div>
    </>
  );
});
