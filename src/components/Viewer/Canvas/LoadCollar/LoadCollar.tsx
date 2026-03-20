import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { Stitches } from './Stitches';
import { Web } from './Web';
import { Buckle } from './Buckle';

type LoadCollarProps = {
  url: string;
};

export const LoadCollar = ({ url }: LoadCollarProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return (
    <>
      <Buckle />
      <Stitches />
      <Web />
    </>
  );
};
