import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import WebTextured from '../EffectObj/WebTextured';
import { Buckle } from './Buckle';
import { Stitches } from './Stitches';
import EngravedBuckle from './EngravedBuckle';
import { observer } from 'mobx-react-lite';
import WebbingText from './WebbingText';
import { TextSize } from '../../../../state/product/types';

type LoadCollarProps = {
  url: string;
  plasticUrl: string;
};

export const LoadCollar = observer(({ url, plasticUrl }: LoadCollarProps) => {
  const { designManager, design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);
  const plasticRes = useGLTF(plasticUrl);
  const plasticScene = plasticRes.scene;

  const webbingTextManager = designManager.productManager.webbingText;
  const webText = meshManager.webMeshes.get('Web_Text');
  const selectedFont = webbingTextManager.selectedFontDescription?.font_path;

  const selectedSize = webbingTextManager.size;
  const fontSize = fontSizeRecord[selectedSize];

  useEffect(() => {
    meshManager.setMeshGroup(url, scene, 'DEFAULT');
    meshManager.setMeshGroup(plasticUrl, plasticScene, 'PLASTIC');
  }, [meshManager, plasticScene, plasticUrl, scene, url]);

  return (
    <>
      <Buckle />
      <Stitches />
      <WebTextured texturedName="Web" />
      <EngravedBuckle />
      <WebbingText
        mesh={webText}
        text={webbingTextManager.value}
        color={webbingTextManager.selectedColor}
        fontUrl={selectedFont}
        fontSize={fontSize}
      />
    </>
  );
});

const fontSizeRecord: Record<TextSize, number> = {
  SMALL: 200,
  MEDIUM: 300,
  LARGE: 400
}