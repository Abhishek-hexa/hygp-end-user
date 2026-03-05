import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { toJS } from 'mobx';

export const DesignTab = observer(() => {
  const { designManager } = useMainContext();
  const textureManager = designManager.productManager.textureManager;
  const textures = Array.from(textureManager.availableCollections.values());

return (
  <div className="w-full space-y-2">
    {textures.map((texture) => (
      <div key={texture.id} className="rounded-xl border border-gray-300 p-2 text-sm text-gray-600">
        {texture.title}
      </div>
    ))}
  </div>
);

});
