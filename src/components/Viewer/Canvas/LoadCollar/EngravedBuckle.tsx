import { Decal } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';

const EngravedBuckle = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const planeMesh = design3DManager.meshManager.buckleMeshes.get('Plane');
  const selectedColor = designManager.productManager.buckleManager.currentSelectedColorDescription?.hex;

  return (
    <>
      {/* {planeMesh && <MetalObj mesh={planeMesh} metalColor={selectedColor}  />} */}
      <EngravedMesh />
    </>
  );
});

export default EngravedBuckle;

const EngravedMesh = observer(function EngravedMesh() {
  const { design3DManager } = useMainContext();
  const manager = design3DManager.engraving3Dmanager;
  const planeMesh = design3DManager.meshManager.buckleMeshes.get('Plane');
  const decalHostRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useFrame(() => {
    if (!decalHostRef.current || !planeMesh) {
      return;
    }

    decalHostRef.current.position.copy(planeMesh.position);
    decalHostRef.current.rotation.copy(planeMesh.rotation);
    decalHostRef.current.scale.copy(planeMesh.scale);
  });

  useEffect(() => {
    if (!manager.imageUrl && !manager.loading && !manager.error) {
      void manager.refreshTexture();
    }
  }, [manager, manager.imageUrl, manager.loading, manager.error]);

  useEffect(() => {
    if (!manager.imageUrl) {
      setTexture(null);
      return;
    }

    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      manager.imageUrl,
      (loadedTexture) => {
        if (!active) {
          loadedTexture.dispose();
          return;
        }
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      () => {
        if (!active) {
          return;
        }
        setTexture(null);
      },
    );

    return () => {
      active = false;
    };
  }, [manager, manager.imageUrl]);

  useEffect(() => {
    return () => {
      if (texture) {
        texture.dispose();
      }
    };
  }, [texture]);

  return (
    <group>
      {planeMesh && (
        <mesh ref={decalHostRef} geometry={planeMesh.geometry}>
          <meshStandardMaterial transparent opacity={0} depthWrite={false} />

          {texture && (
            <Decal position={[0, 0, 0.001]} scale={13} rotation={[0, 0, 0]}>
              <meshBasicMaterial
                map={texture}
                transparent
                polygonOffset
                polygonOffsetFactor={-1}
              />
            </Decal>
          )}
        </mesh>
      )}
    </group>
  );
});
