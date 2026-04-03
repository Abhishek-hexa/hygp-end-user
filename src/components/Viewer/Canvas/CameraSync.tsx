import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';


export const CameraSync = observer(() => {
  const {
    design3DManager: { cameraManager },
  } = useMainContext();
  const { camera } = useThree();
  const controlsRef = cameraManager.controllRef;
  const target = cameraManager.target;
  const { x: tx, y: ty, z: tz } = target;
  const {
    near,
    far,
    fov,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
  } = cameraManager;


  useEffect(() => {
    camera.near = near;
    camera.far = far;

    if ('fov' in camera) {
      camera.fov = fov;
    }
    camera.updateProjectionMatrix();

    if (!controlsRef) {
      camera.lookAt(tx, ty, tz);
      return;
    }

    controlsRef.minDistance = minDistance;
    controlsRef.maxDistance = Math.max(maxDistance, minDistance + 1);
    controlsRef.minPolarAngle = minPolarAngle;
    controlsRef.maxPolarAngle = Math.max(maxPolarAngle, minPolarAngle);
    controlsRef.setTarget(tx, ty, tz, true);

    const clampedDistance = Math.min(
      Math.max(controlsRef.distance, controlsRef.minDistance),
      controlsRef.maxDistance,
    );
    if (Math.abs(clampedDistance - controlsRef.distance) > 0.001) {
      void controlsRef.dollyTo(clampedDistance, true);
    }
  }, [
    camera,
    controlsRef,
    tx,
    ty,
    tz,
    near,
    far,
    fov,
    minDistance,
    maxDistance,
    minPolarAngle,
    maxPolarAngle,
  ]);

  return null;
});
