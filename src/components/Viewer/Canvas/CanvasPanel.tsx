import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import type CameraControlsImpl from 'camera-controls';
import { observer } from 'mobx-react-lite';
import { Suspense, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { LinearToneMapping, SRGBColorSpace } from 'three';

import { useFitModel } from '../../../hooks/useFitModel';
import { useMainContext } from '../../../hooks/useMainContext';
import { CameraFeatureAnimation } from './CameraFeatureAnimation';
import { CameraSync } from './CameraSync';
import LoadEnvironment from './EffectObj/LoadEnvironment';
import RenderModelByComponent from './RenderModelByComponent';

export const CanvasPanel = observer(() => {
  const { design3DManager, designManager, uiManager } = useMainContext();
  const { cameraManager, meshManager } = design3DManager;
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const activeModelKey = designManager.productManager.activeModelKey;
  const activeMesh = activeModelKey ? meshManager.webMesh : undefined;

  useFitModel({
    controlsRef: cameraManager.controllRef,
    key: activeModelKey,
    mesh: activeMesh,
  });

  const handleCameraRef = useCallback(
    (controls: CameraControlsImpl | null) => {
      controlsRef.current = controls;
      design3DManager.cameraManager.setControllRef(controls);
    },
    [design3DManager.cameraManager],
  );

  const handleCreated = useCallback(
    ({ gl }: { gl: THREE.WebGLRenderer }) => {
      design3DManager.setCanvasRef(gl.domElement);
    },
    [design3DManager],
  );

  return (
    <section className="h-full border-r border-gray-200 bg-stone-200 max-lg:border-b max-lg:border-r-0">
      <Canvas
        style={{
          visibility: uiManager.isCanvasVisible ? 'hidden' : 'visible',
        }}
        camera={{
          far: cameraManager.far,
          fov: cameraManager.fov,
          near: cameraManager.near,
          position: [0, 0, 300],
        }}
        gl={{
          antialias: true,
          outputColorSpace: SRGBColorSpace,
          preserveDrawingBuffer: true,
          toneMapping: LinearToneMapping,
          toneMappingExposure: 1.2,
        }}
        onCreated={handleCreated}>
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
