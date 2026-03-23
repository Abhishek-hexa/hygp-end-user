import { useGLTF } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import WebTextured from '../EffectObj/WebTextured';
import Hook from './Hook';

interface LoadLeashProps {
  url: string;
}

const LoadLeash = observer(({ url }: LoadLeashProps) => {
  const { design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;
  const { scene } = useGLTF(url);

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <Hook />
      <WebTextured texturedName="Leash" />
    </>
  );
});

export default LoadLeash;
