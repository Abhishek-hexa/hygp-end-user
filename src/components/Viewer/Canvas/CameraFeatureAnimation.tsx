import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

import { useMainContext } from '../../../hooks/useMainContext';

export const CameraFeatureAnimation = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager, meshManager } = design3DManager;
  const activeFeature = designManager.productManager.activeFeature;
  const controlsRef = cameraManager.controllRef;
  const modelKey = designManager.productManager.activeModelKey;
  const lastActiveFeature = useRef<string | null>(null);
  const lastModelKey = useRef<string | null>(null);

  useEffect(() => {
    if (!controlsRef) return;

    const featureChanged = activeFeature !== lastActiveFeature.current;
    const modelChanged = modelKey !== lastModelKey.current;

    // Only run if the feature tab changed, OR if we're on the SIZE tab and the model changed
    if (!featureChanged && !(activeFeature === 'SIZE' && modelChanged)) {
      return;
    }

    lastActiveFeature.current = activeFeature;
    lastModelKey.current = modelKey;

    // Ensure the model is front-facing when switching to typical tabs
    if (
      !(
        activeFeature === 'COLLAR_TEXT' ||
        activeFeature === 'HARNESS_TEXT' ||
        activeFeature === 'LEASH_TEXT'
      )
    ) {
      void controlsRef.rotateTo(0, Math.PI / 2, true);
    }

    if (activeFeature === 'BUCKLE' || activeFeature === 'ENGRAVING') {
      const buckleMesh = meshManager.buckleMesh;
      if (buckleMesh) {
        void controlsRef.fitToBox(buckleMesh, true, {
          paddingTop: 10,
          paddingLeft: 10,
          paddingBottom: 10,
          paddingRight: 10,
        });
      }
    } else if (
      activeFeature === 'COLLAR_TEXT' ||
      activeFeature === 'HARNESS_TEXT' ||
      activeFeature === 'LEASH_TEXT'
    ) {
      const webTextMesh = meshManager.webTextMesh;
      if (webTextMesh) {
        // Rotate to the side of the collar so the text faces the camera directly
        void controlsRef.rotateTo(Math.PI / 2, Math.PI / 2, true);

        void controlsRef.fitToBox(webTextMesh, true, {
          paddingTop: 20,
          paddingLeft: 20,
          paddingBottom: 20,
          paddingRight: 20,
        });
      }
    } else {
      const modelGroup = modelKey
        ? meshManager.getMeshGroup(modelKey)
        : undefined;
      if (modelGroup) {
        void controlsRef.fitToBox(modelGroup, true);

        if (modelKey) {
          const center = meshManager.getVisibleMeshCenter(modelKey);
          if (center) {
            cameraManager.setTarget(center);
            controlsRef.setTarget(center[0], center[1], center[2], true);
          }
        }
      }
    }
  }, [activeFeature, controlsRef, meshManager, modelKey, cameraManager]);

  useFrame((_, delta) => {
    if (activeFeature === 'DESIGN' && controlsRef) {
      // Apply a subtle continuous rotation.
      // 0.2 radians per second is relatively slow and subtle.
      controlsRef.azimuthAngle += 0.3 * delta;

      // Prevent the angle from winding up infinitely so it doesn't
      // aggressively "anti-rotate" when transitioning back to the front facing view.
      if (controlsRef.azimuthAngle > Math.PI) {
        controlsRef.azimuthAngle -= 2 * Math.PI;
      } else if (controlsRef.azimuthAngle < -Math.PI) {
        controlsRef.azimuthAngle += 2 * Math.PI;
      }
    }
  });

  return null;
});
