import { CameraControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { Suspense, useMemo, useRef } from 'react';
import { LinearToneMapping } from 'three';
import type CameraControlsImpl from 'camera-controls';
import { useMainContext } from '../../../hooks/useMainContext';
import { CameraSync } from './CameraSync';
import { CanvasModel } from './CanvasModel';
import { LoadCollar } from './LoadCollar/LoadCollar';
import LoadLeash from './LoadLeash/LoadLeash';
import LoadHarness from './LoadHarness/LoadHarness';
import LoadMartingale from './LoadMartingale/LoadMartingale';
import LoadEnvironment from './EffectObj/LoadEnvironment';
import { ModelLoadingFallback } from './ModelLoadingFallback';


export const CanvasPanel = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const { productManager } = designManager;
  const controlsRef = useRef<CameraControlsImpl | null>(null);
  const modelUrl = productManager.getModelPath();
  const plasticModelUrl = productManager.getPlasticModelPath();
  const modelLoadingId = useMemo(
    () => `model-${modelUrl ?? 'none'}-${plasticModelUrl ?? 'none'}`,
    [modelUrl, plasticModelUrl],
  );

  const renderModelByComponent = () => {
    if (!modelUrl) {
      return null;
    }

    switch (productManager.productId) {
      case 'DOG_COLLAR':
      case 'CAT_COLLAR':
        return (
          plasticModelUrl && (
            <LoadCollar url={modelUrl} plasticUrl={plasticModelUrl} />
          )
        );
      case 'LEASH':
        return <LoadLeash url={modelUrl} />;
      case 'HARNESS':
        return <LoadHarness url={modelUrl} />;
      case 'MARTINGALE':
        return <LoadMartingale url={modelUrl} />;
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
        <Suspense fallback={<ModelLoadingFallback id={modelLoadingId} />}>
          {renderModelByComponent()}
          <LoadEnvironment />
        </Suspense>
        <CameraSync controlsRef={controlsRef} />

        <CameraControls
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2.5}
          truckSpeed={0}
          maxDistance={800}
          minDistance={200}
          ref={controlsRef}
        />
      </Canvas>
    </section>
  );
});
