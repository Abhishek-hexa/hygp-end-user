import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';

const Model = ({ url }: { url: string }) => {
  if (!url) return null;
  const { scene } = useGLTF(url);
  console.log(scene)
  return <primitive object={scene} />;
};

export const CanvasPanel = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { cameraManager } = design3DManager;
  const modelUrl = designManager.productManager.getModelPath();
  
  return (
    <section className="h-full border-r border-gray-200 bg-stone-200 max-lg:border-b max-lg:border-r-0">
      <Canvas 
        camera={{ 
          position: cameraManager.position, 
          fov: cameraManager.fov, 
          near: cameraManager.near, 
          far: cameraManager.far 
        }}
      >
        <Suspense fallback={null}>
          <Model url={modelUrl ? modelUrl : ""} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls 
          makeDefault 
          target={cameraManager.target} 
          autoRotate={cameraManager.isAutoRotate}
          autoRotateSpeed={cameraManager.autoRotateSpeed}
        />
      </Canvas>
    </section>
  );
});
