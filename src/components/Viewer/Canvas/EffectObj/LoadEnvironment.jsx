import { Environment } from '@react-three/drei';
import { observer } from 'mobx-react-lite';

export const LoadEnvironment = observer(() => {
  return (
    <Environment
      files="/assets/texture/texture/metro_vijzelgracht_1k2.hdr"
      environmentRotation={[-1.72, 0.13, -0.05]}
      resolution={1024}
    />
  );
});

export default LoadEnvironment;
