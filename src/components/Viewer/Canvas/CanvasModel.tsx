import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { useMyGLTF } from '../../../hooks/useMyGLTF';

type CanvasModelProps = {
  url: string;
};

export const CanvasModel = observer(({ url }: CanvasModelProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useMyGLTF(url);

  useEffect(() => {
    meshManager.setMeshGroup(url, scene);
  }, [meshManager, scene, url]);

  return <primitive object={scene} />;
});
