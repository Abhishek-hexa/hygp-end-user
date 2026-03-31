import { useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';

import type CameraControlsImpl from 'camera-controls';

type CameraSyncProps = {
  controlsRef: RefObject<CameraControlsImpl | null>;
};
export const CameraSync = observer(({ controlsRef }: CameraSyncProps) => {
  const {
    design3DManager: { cameraManager },
  } = useMainContext();
  const { camera } = useThree();
  const [tx, ty, tz] = cameraManager.target;
  const { near, far, fov, minDistance, maxDistance } = cameraManager;

  useEffect(() => {
    camera.near = near;
    camera.far = far;

    if ('fov' in camera) {
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();

    if (controlsRef.current) {
      controlsRef.current.minDistance = minDistance;
      controlsRef.current.maxDistance = Math.max(maxDistance, minDistance + 1);
      controlsRef.current.setTarget(tx, ty, tz, true);

      const clampedDistance = Math.min(
        Math.max(controlsRef.current.distance, controlsRef.current.minDistance),
        controlsRef.current.maxDistance,
      );
      if (Math.abs(clampedDistance - controlsRef.current.distance) > 0.001) {
        void controlsRef.current.dollyTo(clampedDistance, true);
      }
      return;
    }

    camera.lookAt(tx, ty, tz);
  }, [camera, controlsRef, tx, ty, tz, near, far, fov, minDistance, maxDistance]);

  return null;
});
