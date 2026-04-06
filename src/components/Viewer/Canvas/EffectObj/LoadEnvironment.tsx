import { Environment } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useMyHdr } from '../../../../hooks/useMyHdr';

const ENV_HDR_PATH = '/assets/texture/texture/metro_vijzelgracht_1k2.hdr';

export const LoadEnvironment = observer(() => {
  const envMap = useMyHdr(ENV_HDR_PATH, { trackLoading: false });

  if (!envMap) return null;

  return (
    <Environment
      map={envMap}
      environmentRotation={[-1.72, 0.13, -0.05]}
      resolution={1024}
    />
  );
});

export default LoadEnvironment;
