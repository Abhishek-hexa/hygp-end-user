import { useGLTF } from '@react-three/drei';
import { useMainContext } from '../../../../hooks/useMainContext';
import BuckleGroup from './BuckleGroup';
import { observer } from 'mobx-react-lite';
import WebGroup from './WebGroup';

interface LoadHarnessProps {
  url: string;
}

const LoadHarness = observer(({ url }: LoadHarnessProps) => {
  const { design3DManager } = useMainContext();
  const meshManger = design3DManager.meshManager;
  const { scene } = useGLTF(url);
  meshManger.setMeshGroup(url, scene);

  return (
    <>
      <BuckleGroup />
      <WebGroup />
    </>
  );
});

export default LoadHarness;
