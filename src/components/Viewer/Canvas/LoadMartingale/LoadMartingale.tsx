import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyGLTF } from '../../../../hooks/useMyGLTF';
import MetalBuckles from './MetalBuckles';
import WebTextured from '../EffectObj/WebTextured';
import WebbingText from '../LoadCollar/WebbingText';

interface LoadMartingaleProps {
  url: string;
}

const LoadMartingale = observer(({ url }: LoadMartingaleProps) => {
  const { designManager, design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useMyGLTF(url);

  const webbingTextManager = designManager.productManager.webbingText;
  const selectedFont = webbingTextManager.selectedFontDescription?.font_path;
  const fontSize = webbingTextManager.size;

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <MetalBuckles />
      <WebTextured texturedName="Martingle" />
      <WebTextured texturedName="Web" />
      <WebbingText
        mesh={meshManager.webTextMesh}
        text={webbingTextManager.value}
        color={webbingTextManager.selectedColor}
        fontUrl={selectedFont}
        fontSize={fontSize}
      />
    </>
  );
});

export default LoadMartingale;
