import { useEffect, type RefObject } from 'react';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useMainContext } from '../../../hooks/useMainContext';

type CameraSyncProps = {
  controlsRef: RefObject<OrbitControlsImpl | null>;
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
      controlsRef.current.target.set(tx, ty, tz);
      controlsRef.current.update();
      return;
    }

    camera.lookAt(tx, ty, tz);
  }, [camera, controlsRef, px, py, pz, tx, ty, tz, near, far, fov]);

  return null;
});
