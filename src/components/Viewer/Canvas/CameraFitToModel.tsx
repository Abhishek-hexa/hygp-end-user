import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';

export const CameraFitToModel = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager, meshManager } = design3DManager;
  const modelKey = designManager.productManager.activeModelKey;
  const controlsRef = cameraManager.controllRef;
  const modelGroup = modelKey ? meshManager.getMeshGroup(modelKey) : undefined;

  useEffect(() => {
    if (!modelGroup || !controlsRef) {
      return;
    }

    let cancelled = false;

    const rotateAndFit = async () => {
      const controls = controlsRef;
      if (!controls) return;

      // Delay animation slightly to allow Three.js to compile shaders 
      // and upload geometry to the GPU without stealing frame time from the animation.
      // await new Promise((resolve) => setTimeout(resolve, 100));
      if (cancelled) return;

      await controls.rotateTo(0, Math.PI / 2);
      if (cancelled) return;

      void controls.fitToBox(modelGroup, true);
      if (cancelled) return;

      if (!modelKey) return;
      const center = meshManager.getVisibleMeshCenter(modelKey);
      if (!center) return;

      cameraManager.setTarget(center);
      controls.setTarget(center.x, center.y, center.z, true);
    };

    void rotateAndFit();

    return () => {
      cancelled = true;
    };
  }, [modelGroup, modelKey]);

  return null;
});
