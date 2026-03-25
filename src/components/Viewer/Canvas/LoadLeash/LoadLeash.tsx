import { useGLTF } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import WebTextured from '../EffectObj/WebTextured';
import Hook from './Hook';
import WebbingText from '../LoadCollar/WebbingText';
import { MetalObj } from '../EffectObj/MetalObj';

interface LoadLeashProps {
  url: string;
}

const LoadLeash = observer(({ url }: LoadLeashProps) => {
  const { designManager, design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;
  const { scene } = useGLTF(url);

  const webText = meshManager.webMeshes.get('Web_Text');
  const webbingTextManager = designManager.productManager.webbingText;
  const selectedFont = webbingTextManager.selectedFontDescription?.font_path;
  const fontSize = webbingTextManager.size;

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <Hook />
      <WebTextured texturedName="Leash" side={true} />
      <WebbingText
        mesh={webText}
        text={webbingTextManager.value}
        color={webbingTextManager.selectedColor}
        fontUrl={selectedFont}
        fontSize={fontSize}
        side={true}
      />
    </>
  );
});

export default LoadLeash;
