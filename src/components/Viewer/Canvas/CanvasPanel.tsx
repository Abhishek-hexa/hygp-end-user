import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useMainContext } from '../../../hooks/useMainContext';
import { CameraSync } from './CameraSync';
import { CanvasModel } from './CanvasModel';
import { LinearToneMapping } from 'three';
import { LoadCollar } from './LoadCollar';

export const CanvasPanel = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const { productManager } = designManager;
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelUrl = productManager.getModelPath();

  const renderModelByComponent = () => {
    if (!modelUrl) {
      return null;
    }

    switch (productManager.productId) {
      case 'DOG_COLLAR':
      case 'CAT_COLLAR':
        return <LoadCollar url={modelUrl} />;
      default:
        return <CanvasModel url={modelUrl} />;
    }
  };

  return (
    <section className="h-full border-r border-gray-200 bg-stone-200 max-lg:border-b max-lg:border-r-0">
      <Canvas
        camera={{
          position: cameraManager.position,
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
          {renderModelByComponent()}
          <Environment preset="city" />
        </Suspense>
        <CameraSync controlsRef={controlsRef} />
        <OrbitControls
          ref={controlsRef}
          makeDefault
          target={cameraManager.target}
          autoRotate={cameraManager.isAutoRotate}
          autoRotateSpeed={cameraManager.autoRotateSpeed}
        />
      </Canvas>
    </section>
  );
});
