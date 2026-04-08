import { useModel } from '../../../../hooks/useModel';
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
  const { webTextMesh, webbingText } = useModel(url, plasticUrl);

  return (
    <>
      <Buckle />
      <Stitches />
      <WebTextured texturedName="Web" />
      <EngravedBuckle />
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
