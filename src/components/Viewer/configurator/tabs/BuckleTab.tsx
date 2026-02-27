import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { toTitleCase } from '../utils';

export const BuckleTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <>
      <h2 className="mb-2 text-[32px] font-bold">Buckle</h2>
      <p className="mb-1.5 font-bold text-[#6E8D84]">Buckle Material</p>
      <div className="mb-2.5 flex flex-row gap-1">
        {(['METAL', 'PLASTIC'] as const).map((type) => {
          const selected = productManager.buckle.type === type;
          return (
            <button
              key={type}
              onClick={() => productManager.buckle.setType(type)}
              className="flex-1 rounded-lg border py-2"
              style={{
                backgroundColor: selected ? '#FCE2E3' : 'transparent',
                borderColor: selected ? '#EE8F90' : '#7AA79A',
                color: selected ? '#E4575E' : '#4A4A4A',
              }}>
              {toTitleCase(type)}
            </button>
          );
        })}
      </div>
      <p className="mb-1.5 font-bold text-[#6E8D84]">Buckle Finish</p>
      <div className="flex flex-row gap-1.5">
        {productManager.buckle.finishColors.map((color) => {
          const selected = productManager.buckle.finishColor === color;
          return (
            <button
              key={color}
              onClick={() => productManager.buckle.setFinishColor(color)}
              className="h-12 min-w-12 rounded-md border-2 p-0"
              style={{
                backgroundColor: color,
                borderColor: selected ? '#EE8F90' : '#7AA79A',
              }}
            />
          );
        })}
      </div>
    </>
  );
});
