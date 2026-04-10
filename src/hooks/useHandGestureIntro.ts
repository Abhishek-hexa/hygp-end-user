import { useEffect, useRef, useState } from 'react';
import type CameraControlsImpl from 'camera-controls';

const TOTAL_DURATION = 2600;
const MAX_HAND_MOVE = 80;
const MAX_ROTATION = Math.PI / 5;

interface UseHandGestureIntroArgs {
  isReady: boolean;
  controls: CameraControlsImpl | null;
  isUserControlling: boolean;
}

export const useHandGestureIntro = ({
  isReady,
  controls,
  isUserControlling,
}: UseHandGestureIntroArgs) => {
  const hasAnimated = useRef(false);
  const [handX, setHandX] = useState(0);
  const [showHand, setShowHand] = useState(false);
  const hideHandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!controls) return;
    if (isUserControlling) {
      setHandX(0);
      setShowHand(false);
      return;
    }
    if (!isReady || hasAnimated.current) return;

    hasAnimated.current = true;
    controls.smoothTime = 0.6;

    const startAzimuth = controls.azimuthAngle;
    const startPolar = controls.polarAngle;
    let animationFrame: number;
    let startTime: number | null = null;

    setShowHand(true);

    const animate = (timestamp: number) => {
      startTime ??= timestamp;
      const progress = Math.min((timestamp - startTime) / TOTAL_DURATION, 1);
      const wave = Math.sin(progress * Math.PI * 2);

      setHandX(wave * MAX_HAND_MOVE);
      void controls.rotateTo(startAzimuth - wave * MAX_ROTATION, startPolar, false);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setHandX(0);
        void controls.rotateTo(startAzimuth, startPolar, false);
        hideHandTimeoutRef.current = setTimeout(() => setShowHand(false), 300);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrame);
      if (hideHandTimeoutRef.current !== null) {
        clearTimeout(hideHandTimeoutRef.current);
        hideHandTimeoutRef.current = null;
      }
      if (isUserControlling) {
        setHandX(0);
        setShowHand(false);
      }
    };
  }, [controls, isReady, isUserControlling]);

  const handStyle: React.CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '65%',
    transform: `translate(calc(-50% + ${handX}px), -50%)`,
    width: '64px',
    height: '64px',
    pointerEvents: 'none',
    opacity: showHand ? 1 : 0,
    transition: 'opacity 0.3s ease',
    zIndex: 20,
  };

  return { showHand, handStyle };
};
