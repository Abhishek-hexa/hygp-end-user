import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { resolvePatternPreview } from '../utils';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="mb-2 text-[32px] font-bold">Select Design</h2>
      <div className="grid h-full min-h-0 grid-cols-1 gap-2 overflow-hidden md:grid-cols-[190px_1fr]">
        <div className="min-h-0 overflow-y-auto pr-1 md:border-r md:border-[#d8ddd9]">
          {productManager.backendCollections.map((collection) => {
            const selected =
              productManager.selectedCollectionId === collection.id;
            return (
              <button
                key={collection.id}
                onClick={() =>
                  productManager.setSelectedCollectionId(collection.id)
                }
                className="mb-1 w-full rounded-lg border py-1.5 text-left px-2"
                style={{
                  borderColor: selected ? '#7AA79A' : '#D5DEDB',
                  color: selected ? '#2b6f61' : '#5e6e67',
                }}>
                {collection.name}
              </button>
            );
          })}
        </div>

        <div className="flex min-h-0 min-w-0 flex-col">
          <h3 className="mb-1.5 text-[24px] font-bold text-[#2d3d37]">
            {
              productManager.backendCollections.find(
                (collection) =>
                  collection.id === productManager.selectedCollectionId,
              )?.name
            }
          </h3>
          <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5 overflow-y-auto overflow-x-hidden pr-0.5">
            {productManager.backendPatterns.map((pattern) => {
              const texture = pattern.textureUrl || pattern.image;
              const selected = productManager.material.material === texture;
              const preview = resolvePatternPreview(pattern);
              return (
                <button
                  key={pattern.id}
                  onClick={() => productManager.material.setMaterial(texture)}
                  className="h-[78px] min-w-0 overflow-hidden rounded-lg border-2 p-0"
                  style={{
                    borderColor: selected ? '#EE8F90' : '#D4DEDA',
                  }}>
                  <div
                    className="h-full w-full bg-[#f0f0f0] bg-cover bg-center"
                    style={{
                      backgroundImage: preview ? `url(${preview})` : 'none',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});
