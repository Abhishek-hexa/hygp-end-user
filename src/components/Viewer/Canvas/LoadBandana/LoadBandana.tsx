import { observer } from 'mobx-react-lite';
import { useModel } from '../../../../hooks/useModel';
import WebTextured from '../EffectObj/WebTextured';
import { Stitches } from '../LoadCollar/Stitches';

interface LoadBandanaProps {
  url: string;
}

const LoadBandana = observer(({ url }: LoadBandanaProps) => {
  useModel(url);

  return (
    <>
      <WebTextured
        texturedName='Base'
        side={true}
        normalRepeat={[10, 10]}
        rasterHeight={1024}
        useLegacyBandanaTransform={true}
      />
      <Stitches />
    </>
  );
});

export default LoadBandana;
