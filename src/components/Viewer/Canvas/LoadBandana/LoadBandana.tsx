import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyGLTF } from '../../../../hooks/useMyGLTF';
import { useEffect } from 'react';
import WebTextured from '../EffectObj/WebTextured';
import { Stitches } from '../LoadCollar/Stitches';

interface LoadBandanaProps {
  url: string;
}

const LoadBandana = observer(({ url }: LoadBandanaProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useMyGLTF(url);

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <WebTextured texturedName='Base' />
      <Stitches />
    </>
  );
});

export default LoadBandana;
