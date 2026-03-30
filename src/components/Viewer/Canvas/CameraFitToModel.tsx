import { observer } from 'mobx-react-lite';
import { type RefObject, useEffect } from 'react';
import type CameraControlsImpl from 'camera-controls';
import { useMainContext } from '../../../hooks/useMainContext';

type CameraFitToModelProps = {
  controlsRef: RefObject<CameraControlsImpl | null>;
  modelKey: string | null;
};

export const CameraFitToModel = observer(
  ({ controlsRef, modelKey }: CameraFitToModelProps) => {
    const { design3DManager } = useMainContext();
    const modelGroup = modelKey
      ? design3DManager.meshManager.getMeshGroup(modelKey)
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

        await controls.fitToBox(modelGroup, true);
      };

      void rotateAndFit();

      return () => {
        cancelled = true;
      };
    }, [controlsRef, modelGroup]);

    return null;
  },
);
