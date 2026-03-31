import type CameraControlsImpl from 'camera-controls';
import { observer } from 'mobx-react-lite';
import { type RefObject, useEffect } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';

type CameraFitToModelProps = {
  controlsRef: RefObject<CameraControlsImpl | null>;
  modelKey: string | null;
};

export const CameraFitToModel = observer(
  ({ controlsRef, modelKey }: CameraFitToModelProps) => {
    const { design3DManager } = useMainContext();
    const { cameraManager, meshManager } = design3DManager;
    const modelGroup = modelKey
      ? meshManager.getMeshGroup(modelKey)
      : undefined;

    useEffect(() => {
      if (!modelGroup || !controlsRef.current) {
        return;
      }

      let cancelled = false;

      const rotateAndFit = async () => {
        const controls = controlsRef.current;
        if (!controls) return;

        await controls.rotateTo(0, Math.PI / 2);
        if (cancelled) return;

        void controls.fitToBox(modelGroup, true);
        if (cancelled) return;

        if (!modelKey) return;
        const center = meshManager.getVisibleMeshCenter(modelKey);
        if (!center) return;

        cameraManager.setTarget(center);
        controls.setTarget(center[0], center[1], center[2], true);
      };

      void rotateAndFit();

      return () => {
        cancelled = true;
      };
    }, [cameraManager, controlsRef, meshManager, modelGroup, modelKey]);

    return null;
  },
);
