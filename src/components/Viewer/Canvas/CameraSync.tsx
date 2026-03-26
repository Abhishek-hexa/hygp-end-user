import { useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';

import type CameraControlsImpl from 'camera-controls';

type CameraSyncProps = {
  controlsRef: React.RefObject<CameraControlsImpl | null>;
};
export const CameraSync = observer(({ controlsRef }: CameraSyncProps) => {
  const {
    design3DManager: { cameraManager },
  } = useMainContext();
  const { camera } = useThree();
  const [px, py, pz] = cameraManager.position;
  const [tx, ty, tz] = cameraManager.target;
  const { near, far, fov } = cameraManager;

  useEffect(() => {
    camera.position.set(px, py, pz);
    camera.near = near;
    camera.far = far;

    if ('fov' in camera) {
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.setLookAt(
        px, py, pz,   // camera position
        tx, ty, tz,   // target
        true          // smooth transition
      );
      return;
    }

    camera.lookAt(tx, ty, tz);
  }, [camera, controlsRef, px, py, pz, tx, ty, tz, near, far, fov]);

  return null;
});
