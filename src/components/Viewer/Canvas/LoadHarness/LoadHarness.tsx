import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import BuckleGroup from './BuckleGroup';
import { observer } from 'mobx-react-lite';
import WebGroup from './WebGroup';
import { useMyGLTF } from '../../../../hooks/useMyGLTF';

interface LoadHarnessProps {
  url: string;
}

const LoadHarness = observer(({ url }: LoadHarnessProps) => {
  const { design3DManager } = useMainContext();
  const meshManger = design3DManager.meshManager;
  const { scene } = useMyGLTF(url);

  useEffect(() => {
    meshManger.setMeshGroup(url, scene);
  }, [meshManger, scene, url]);

  return (
    <>
      <BuckleGroup />
      <WebGroup />
    </>
  );
});

export default LoadHarness;
