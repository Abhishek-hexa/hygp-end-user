import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyGLTF } from '../../../../hooks/useMyGLTF';
import { ProductType } from '../../../../state/product/types';
import WebTextured from '../EffectObj/WebTextured';
import { Buckle } from './Buckle';
import { Stitches } from './Stitches';
import { observer } from 'mobx-react-lite';
import WebbingText from './WebbingText';
import { EngravedBuckle } from './EngravedBuckle';

type LoadCollarProps = {
  url: string;
  plasticUrl: string;
};

export const LoadCollar = observer(({ url, plasticUrl }: LoadCollarProps) => {
  const { designManager, design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { productManager } = designManager;
  const { buckleManager } = productManager;
  const isPlasticMaterial = buckleManager.material === 'PLASTIC';
  const modelUrl = isPlasticMaterial ? plasticUrl : url;
  const isDogPlasticModel =
    productManager.productId === ProductType.DOG_COLLAR && isPlasticMaterial;
  const { scene } = useMyGLTF(modelUrl);

  const webbingTextManager = designManager.productManager.webbingText;
  const selectedFont = webbingTextManager.selectedFontDescription?.font_path;

  const selectedSize = webbingTextManager.size;

  useEffect(() => {
    meshManager.setMeshGroup(
      modelUrl,
      scene,
      isDogPlasticModel ? 'PLASTIC' : 'DEFAULT',
    );
  }, [isDogPlasticModel, meshManager, modelUrl, scene]);



  return (
    <>
      <Buckle />
      <Stitches />
      <WebTextured texturedName="Web" />
      <EngravedBuckle />
      <WebbingText
        mesh={meshManager.webTextMesh}
        text={webbingTextManager.value}
        color={webbingTextManager.selectedColor}
        fontUrl={selectedFont}
        fontSize={selectedSize}
      />
    </>
  );
});
