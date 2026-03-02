import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { resolvePatternPreview } from '../utils';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;
  const { texture } = productManager;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <h2 className="mb-2 text-[32px] font-bold">Select Design</h2>
      <div className="grid h-full min-h-0 grid-cols-1 gap-2 overflow-hidden md:grid-cols-[190px_1fr]">
        <div className="min-h-0 overflow-y-auto pr-1 md:border-r md:border-[#d8ddd9]">
          {texture.backendCollections.map((collection) => {
            const selected = texture.selectedCollectionId === collection.id;
            return (
              <button
                key={collection.id}
                onClick={() => texture.setSelectedCollectionId(collection.id)}
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
              texture.backendCollections.find(
                (collection) => collection.id === texture.selectedCollectionId,
              )?.name
            }
          </h3>
          <div className="grid min-h-0 flex-1 grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-1.5 overflow-y-auto overflow-x-hidden pr-0.5">
            {texture.backendPatterns.map((pattern) => {
              const textureUrl = pattern.textureUrl || pattern.image;
              const selected = texture.texture === textureUrl;
              const preview = resolvePatternPreview(pattern);
              return (
                <button
                  key={pattern.id}
                  onClick={() => texture.setTexture(textureUrl)}
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
