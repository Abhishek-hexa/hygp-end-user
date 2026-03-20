import { useGLTF } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';

type CanvasModelProps = {
  url: string;
};

export const CanvasModel = observer(({ url }: CanvasModelProps) => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { scene } = useGLTF(url);
  meshManager.setMeshGroup(url, scene);

  return <primitive object={scene} />;
});
