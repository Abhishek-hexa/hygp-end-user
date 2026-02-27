import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { textColorOptions } from '../constants';

export const CollarTextTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <>
      <h2 className="mb-2 text-[32px] font-bold">Collar Text</h2>
      <p className="mb-1 font-bold text-[#6E8D84]">Custom Text</p>
      <div className="mb-2 flex flex-row gap-[5px]">
        <input
          type="text"
          value={productManager.text.value}
          onChange={(e) =>
            productManager.text.setText(e.target.value.slice(0, 20))
          }
          placeholder="Type your text here"
          className="w-full rounded-md border border-[#B8CCC5] bg-white px-3 py-2 text-sm text-[#2d3d37] outline-none focus:border-[#7AA79A]"
        />
        <select
          value={productManager.text.font.selectedFont ?? ''}
          onChange={(e) => productManager.text.setFont(String(e.target.value))}
          className="min-w-[130px] rounded-md border border-[#B8CCC5] bg-white px-2 py-2 text-sm text-[#2d3d37] outline-none focus:border-[#7AA79A]">
          <option value="" disabled>
            Select font
          </option>
          {productManager.text.font.availableFonts.map((font) => (
            <option key={font.id} value={font.family}>
              {font.family}
            </option>
          ))}
        </select>
      </div>
      <hr className="mb-2 border-0 border-t border-[#d8d8d8]" />
      <p className="mb-1 font-bold text-[#6E8D84]">Color of Text</p>
      <div className="mb-2.5 flex flex-row gap-[5px]">
        {textColorOptions.map((option) => (
          <button
            key={option}
            onClick={() => productManager.text.setColor(option)}
            className="h-[38px] min-w-[38px] rounded-full border-2 p-0"
            style={{
              backgroundColor: option,
              borderColor:
                productManager.text.color === option ? '#EE8F90' : '#6FA096',
            }}
          />
        ))}
      </div>
      <p className="mb-1 font-bold text-[#6E8D84]">Size of Text</p>
      <div className="flex flex-row gap-1">
        {(['small', 'medium', 'large'] as const).map((option) => (
          <button
            key={option}
            onClick={() => productManager.text.setSize(option)}
            className="flex-1 rounded-lg border py-2 capitalize"
            style={{
              backgroundColor:
                productManager.text.size === option ? '#FCE2E3' : 'transparent',
              borderColor:
                productManager.text.size === option ? '#EE8F90' : '#7AA79A',
              color:
                productManager.text.size === option ? '#E4575E' : '#4A4A4A',
            }}>
            {option}
          </button>
        ))}
      </div>
    </>
  );
});
