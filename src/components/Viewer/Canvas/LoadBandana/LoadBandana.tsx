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
      <WebTextured texturedName='Base' heightRepeat={3} rasterHeight={2048} />
      <Stitches />
    </>
  );
});

export default LoadBandana;
