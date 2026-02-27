import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { ProductManager } from '../../../../state/product/ProductManager';

export const EngravingTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <>
      <h2 className="mb-2 text-[32px] font-bold">Buckle Engraving</h2>
      <div className="flex flex-col gap-[5px]">
        {[0, 1, 2, 3].map((index) => (
          <div key={`engraving-${index}`} className="flex flex-row gap-[5px]">
            <input
              type="text"
              value={productManager.engraving.lines[index] ?? ''}
              onChange={(event) =>
                updateEngravingLine(
                  productManager,
                  index,
                  event.target.value.slice(0, 20),
                )
              }
              placeholder={index === 0 ? 'Pet Name' : `Line ${index + 1}`}
              className="w-full rounded-md border border-[#B8CCC5] bg-white px-3 py-2 text-sm text-[#2d3d37] outline-none focus:border-[#7AA79A]"
            />
            <select
              value={productManager.engraving.font.selectedFont ?? ''}
              onChange={(event) =>
                productManager.engraving.setFont(String(event.target.value))
              }
              className="min-w-[130px] rounded-md border border-[#B8CCC5] bg-white px-2 py-2 text-sm text-[#2d3d37] outline-none focus:border-[#7AA79A]">
              <option value="" disabled>
                Select font
              </option>
              {productManager.engraving.font.availableFonts.map((font) => (
                <option key={font.id} value={font.family}>
                  {font.family}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </>
  );
});

const updateEngravingLine = (
  productManager: ProductManager,
  index: number,
  value: string,
) => {
  const nextLines = [...productManager.engraving.lines];
  while (nextLines.length < 4) nextLines.push('');
  nextLines[index] = value;
  productManager.engraving.setLines(nextLines);
};
