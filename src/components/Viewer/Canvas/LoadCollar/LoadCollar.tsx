import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyGLTF } from '../../../../hooks/useMyGLTF';
import { CachedAssets } from '../../../../loaders/CachedAssets';
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
  const { scene } = useMyGLTF(url);

  const webbingTextManager = designManager.productManager.webbingText;
  const selectedFont = webbingTextManager.selectedFontDescription?.font_path;

  const selectedSize = webbingTextManager.size;

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  useEffect(() => {
    let active = true;

    // Preload/register plastic variant in background so default loader can complete immediately.
    void CachedAssets.loadModel(plasticUrl)
      .then((result) => {
        if (!active || !result.asset) return;
        meshManager.setMeshGroup(plasticUrl, result.asset.scene, 'PLASTIC');
      });

    return () => {
      active = false;
    };
  }, [meshManager, plasticUrl]);

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
