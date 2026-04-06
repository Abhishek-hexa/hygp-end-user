import { observer } from 'mobx-react-lite';
import { useModel } from '../../../../hooks/useModel';
import MetalBuckles from './MetalBuckles';
import WebTextured from '../EffectObj/WebTextured';
import WebbingText from '../LoadCollar/WebbingText';

interface LoadMartingaleProps {
  url: string;
}

const LoadMartingale = observer(({ url }: LoadMartingaleProps) => {
  const { webTextMesh, webbingText } = useModel(url);

  return (
    <>
      <MetalBuckles />
      <WebTextured texturedName="Martingle" />
      <WebTextured texturedName="Web" />
      <WebbingText
        mesh={webTextMesh}
        text={webbingText.text}
        color={webbingText.color}
        fontUrl={webbingText.fontUrl}
        fontSize={webbingText.fontSize}
      />
    </>
  );
});

export default LoadMartingale;
