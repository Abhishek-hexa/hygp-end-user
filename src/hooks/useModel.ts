import { useEffect } from 'react';
import { useMainContext } from './useMainContext';
import { useMyGLTF } from './useMyGLTF';
import { ProductType } from '../state/product/types';

type ModelVariant = 'DEFAULT' | 'PLASTIC';

export function useModel(defaultUrl: string, plasticUrl?: string) {
  const { designManager, design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { productManager } = designManager;
  const webbingTextManager = productManager.webbingText;
  const isDogCollar = productManager.productId === ProductType.DOG_COLLAR;
  const isPlasticMaterial = productManager.buckleManager.material === 'PLASTIC';
  const usePlasticModel = isDogCollar && isPlasticMaterial && Boolean(plasticUrl);
  const modelUrl =
    isDogCollar && isPlasticMaterial && plasticUrl ? plasticUrl : defaultUrl;
  const variant: ModelVariant = usePlasticModel ? 'PLASTIC' : 'DEFAULT';
  const { scene } = useMyGLTF(modelUrl);

  useEffect(() => {
    meshManager.setMeshGroup(modelUrl, scene, variant);
  }, [meshManager, modelUrl, scene, variant]);

  return {
    webTextMesh: meshManager.webTextMesh,
    webbingText: {
      text: webbingTextManager.value,
      color: webbingTextManager.selectedColor,
      fontUrl: webbingTextManager.selectedFontDescription?.font_path,
      fontSize: webbingTextManager.size,
    },
  };
}
