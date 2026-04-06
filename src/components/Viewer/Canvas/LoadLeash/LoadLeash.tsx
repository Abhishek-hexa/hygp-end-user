import { observer } from 'mobx-react-lite';
import { useModel } from '../../../../hooks/useModel';
import WebTextured from '../EffectObj/WebTextured';
import Hook from './Hook';
import WebbingText from '../LoadCollar/WebbingText';

interface LoadLeashProps {
  url: string;
}

const LoadLeash = observer(({ url }: LoadLeashProps) => {
  const { webTextMesh, webbingText } = useModel(url);

  return (
    <>
      <Hook />
      <WebTextured texturedName="Leash" side={true} />
      <WebbingText
        mesh={webTextMesh}
        text={webbingText.text}
        color={webbingText.color}
        fontUrl={webbingText.fontUrl}
        fontSize={webbingText.fontSize}
        side={true}
      />
    </>
  );
});

export default LoadLeash;
