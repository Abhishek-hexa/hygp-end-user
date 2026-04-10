import { useEffect, useRef } from 'react';
import type CameraControlsImpl from 'camera-controls';
import { Vector3 } from 'three';

interface UseModelStartAnimationArgs {
  isReady: boolean;
  controls: CameraControlsImpl | null;
  isUserControlling: boolean;
  onComplete: (isComplete: boolean) => void;
}

export const useModelStartAnimation = ({
  isReady,
  controls,
  isUserControlling,
  onComplete,
}: UseModelStartAnimationArgs) => {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isUserControlling) return;
    if (!isReady || hasAnimated.current) return;
    if (!controls) return;

    hasAnimated.current = true;
    let isAborted = false;

    const runPremiumIntroAnimation = async () => {
      try {
        /**
         * Save original camera state
         */
        const originPosition = new Vector3();
        const originTarget = new Vector3();

        controls.getPosition(originPosition);
        controls.getTarget(originTarget);

        /**
         * Optional: smoother premium motion
         */
        controls.smoothTime = 0.8;

        /**
         * STEP 1:
         * Move camera to premium elevated cinematic angle
         */
        void controls.setLookAt(
          originPosition.x + 1.5,
          originPosition.y + 70,
          originPosition.z + 2.2,
          originTarget.x,
          originTarget.y + 0.2,
          originTarget.z,
          true
        );

        /**
         * STEP 2:
         * Full clockwise rotation (360°)
         */
        await controls.rotate(Math.PI * 2, 0, true);

        /**
         * Notify UI manager that start animation is complete
         */
        if (isAborted || isUserControlling) return;
        onComplete(true);

        /**
         * STEP 3:
         * Return camera to exact original resting position
         */
        // await controls.setLookAt(
        //   originPosition.x,
        //   originPosition.y,
        //   originPosition.z,
        //   originTarget.x,
        //   originTarget.y,
        //   originTarget.z,
        //   true
        // );
      } catch (error) {
        console.error('Start animation failed:', error);
      }
    };

    runPremiumIntroAnimation();
    return () => {
      isAborted = true;
      controls.cancel();
    };
  }, [controls, isReady, isUserControlling, onComplete]);
};
