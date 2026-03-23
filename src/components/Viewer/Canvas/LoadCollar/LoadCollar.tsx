import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { Stitches } from './Stitches';
import { Web } from './Web';
import { Buckle } from './Buckle';

type LoadCollarProps = {
  url: string;
  plasticUrl: string;
};

export const LoadCollar = ({ url, plasticUrl }: LoadCollarProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);
  const plasticRes = useGLTF(plasticUrl);
  const plasticScene = plasticRes.scene;

  useEffect(() => {
    meshManager.setMeshGroup(url, scene, 'DEFAULT');
    meshManager.setMeshGroup(plasticUrl, plasticScene, 'PLASTIC');
  }, [meshManager, plasticScene, plasticUrl, scene, url]);

  return (
    <>
      <Buckle />
      <Stitches />
      <Web />
    </>
  );
};
