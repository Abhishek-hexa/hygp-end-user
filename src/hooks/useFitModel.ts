import { useEffect } from 'react';
import type CameraControlsImpl from 'camera-controls';
import type { Object3D } from 'three';

interface FitModelOptions {
  controlsRef: CameraControlsImpl | null;
  mesh?: Object3D | null;
  key: string | null;
}

export const useFitModel = ({ controlsRef, mesh, key }: FitModelOptions) => {
  useEffect(() => {
    if (!mesh || !controlsRef) return;

    void controlsRef.rotateTo(0, Math.PI / 2, true);

    void controlsRef.fitToBox(mesh, true, {
      paddingTop: 40,
      paddingLeft: 40,
      paddingBottom: 40,
      paddingRight: 40,
    });
  }, [controlsRef, mesh, key]);
};
