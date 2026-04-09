import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { Suspense, useCallback, useRef } from 'react';
import { LinearToneMapping, SRGBColorSpace } from 'three';
import type CameraControlsImpl from 'camera-controls';
import { useMainContext } from '../../../hooks/useMainContext';
import { CameraSync } from './CameraSync';
import { CameraFeatureAnimation } from './CameraFeatureAnimation';
import LoadEnvironment from './EffectObj/LoadEnvironment';
import RenderModelByComponent from './RenderModelByComponent';
import { useFitModel } from '../../../hooks/useFitModel';

export const CanvasPanel = observer(() => {
  const { design3DManager, designManager, uiManager } = useMainContext();
  const { cameraManager, meshManager } = design3DManager;
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const activeModelKey = designManager.productManager.activeModelKey;
  const activeMesh = activeModelKey
    ? meshManager.webMesh
    : undefined;

  useFitModel({
    controlsRef: cameraManager.controllRef,
    mesh: activeMesh,
    key: activeModelKey,
  });

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
        style={{
          visibility: uiManager.isCanvasVisible ? 'hidden' : 'visible',
        }}
        camera={{
          position: [0, 0, 300],
          far: cameraManager.far,
          near: cameraManager.near,
          fov: cameraManager.fov,
        }}
        gl={{
          antialias: true,
          outputColorSpace: SRGBColorSpace,
          toneMapping: LinearToneMapping,
          toneMappingExposure: 1.2,
        }}>
        <Suspense fallback={null}>
          <RenderModelByComponent />
          <LoadEnvironment />
        </Suspense>
        <CameraSync />
        <CameraFeatureAnimation />

        <CameraControls
          maxPolarAngle={cameraManager.maxPolarAngle}
          minPolarAngle={cameraManager.minPolarAngle}
          truckSpeed={0}
          maxDistance={cameraManager.maxDistance}
          minDistance={cameraManager.minDistance}
          onControlStart={() => cameraManager.setIsUserControlling(true)}
          onControlEnd={() => cameraManager.setIsUserControlling(false)}
          ref={handleCameraRef}
        />
      </Canvas>
    </section>
  );
});
