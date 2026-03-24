import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { useGLTF } from '@react-three/drei';
import MetalBuckles from './MetalBuckles';
import WebTextured from '../EffectObj/WebTextured';

interface LoadMartingaleProps {
  url: string;
}

const LoadMartingale = observer(({ url }: LoadMartingaleProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <MetalBuckles />
      <WebTextured texturedName='Martingle' />
      <WebTextured texturedName='Web' />
    </>
  );
});

export default LoadMartingale;
