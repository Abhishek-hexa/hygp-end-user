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
    const modelGroup = modelKey
      ? design3DManager.meshManager.getMeshGroup(modelKey)
      : undefined;

    useEffect(() => {
      if (!modelGroup || !controlsRef.current) {
        return;
      }

      void controlsRef.current.fitToBox(modelGroup, true);
    }, [controlsRef, modelGroup]);

    return null;
  },
);
