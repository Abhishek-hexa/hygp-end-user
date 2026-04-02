import { useFrame } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';

export const CameraFeatureAnimation = observer(() => {
  const { design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;

  useFrame((_, delta) => {
    cameraManager.updateCameraAnimation(delta);
  });

  return null;
});
