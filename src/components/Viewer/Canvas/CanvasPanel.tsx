import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { Suspense, useCallback, useRef } from 'react';
import { LinearToneMapping } from 'three';
import type CameraControlsImpl from 'camera-controls';
import { useMainContext } from '../../../hooks/useMainContext';
import { CameraSync } from './CameraSync';
import { CameraFitToModel } from './CameraFitToModel';
import { CameraFeatureAnimation } from './CameraFeatureAnimation';
import LoadEnvironment from './EffectObj/LoadEnvironment';
import { ModelLoadingFallback } from './ModelLoadingFallback';
import RenderModelByComponent from './RenderModelByComponent';

export const CanvasPanel = observer(() => {
  const { design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const controlsRef = useRef<CameraControlsImpl | null>(null);

  const handleCameraRef = useCallback(
    (controls: CameraControlsImpl | null) => {
      controlsRef.current = controls;
      design3DManager.cameraManager.setControllRef(controls);
    },
    [design3DManager.cameraManager],
  );

  return (
    <section className="h-full border-r border-gray-200 bg-stone-200 max-lg:border-b max-lg:border-r-0">
      <Canvas
        camera={{
          position: [0, 0, 300],
          far: cameraManager.far,
          near: cameraManager.near,
          fov: cameraManager.fov,
        }}
        gl={{
          antialias: true,
          outputColorSpace: 'srgb' as const,
          toneMapping: LinearToneMapping,
          toneMappingExposure: 1.2,
        }}>
        <Suspense fallback={null}>
          <RenderModelByComponent />
          <LoadEnvironment />
        </Suspense>
        <CameraSync />
        <CameraFitToModel />
        <CameraFeatureAnimation />

        <CameraControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
          truckSpeed={0}
          maxDistance={cameraManager.maxDistance}
          minDistance={cameraManager.minDistance}
          ref={handleCameraRef}
        />
      </Canvas>
    </section>
  );
});
