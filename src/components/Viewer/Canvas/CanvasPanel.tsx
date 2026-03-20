import { Suspense, useEffect, useRef, type RefObject } from 'react';
import { Canvas } from '@react-three/fiber';
import { useThree } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import {LinearToneMapping} from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useMainContext } from '../../../hooks/useMainContext';

const Model = observer(({ url }: { url: string }) => {
  const { design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;

  if (!url) return null;
  const { scene } = useGLTF(url);
  meshManager.setMeshGroup(url, scene);
  return <primitive object={scene} />;
});

const CameraSync = observer(
  ({
    controlsRef,
  }: {
    controlsRef: RefObject<OrbitControlsImpl | null>;
  }) => {
    const { design3DManager } = useMainContext();
    const { cameraManager } = design3DManager;
    const { camera } = useThree();

    const [px, py, pz] = cameraManager.position;
    const [tx, ty, tz] = cameraManager.target;

    useEffect(() => {
      camera.position.set(px, py, pz);
      camera.near = cameraManager.near;
      camera.far = cameraManager.far;
      camera.fov = cameraManager.fov;
      camera.updateProjectionMatrix();

      if (controlsRef.current) {
        controlsRef.current.target.set(tx, ty, tz);
        controlsRef.current.update();
      } else {
        camera.lookAt(tx, ty, tz);
      }
    }, [
      camera,
      controlsRef,
      px,
      py,
      pz,
      tx,
      ty,
      tz,
      cameraManager.near,
      cameraManager.far,
      cameraManager.fov,
    ]);

    return null;
  },
);

export const CanvasPanel = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const modelUrl = designManager.productManager.getModelPath();
  
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
                outputColorSpace: 'srgb',
                toneMapping: LinearToneMapping,
                toneMappingExposure: 1.2,
            }}>
        <Suspense fallback={null}>
          <Model url={modelUrl ? modelUrl : ""} />
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
