import { Decal } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';


export const EngravedBuckle = observer(function EngravedMesh() {
  const { design3DManager } = useMainContext();
  const manager = design3DManager.engraving3Dmanager;
  const planeMesh = design3DManager.meshManager.buckleMeshes.get('Plane');
  const decalHostRef = useRef<THREE.Mesh>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [decalTransform, setDecalTransform] = useState<{
    position: [number, number, number];
    scale: [number, number, number];
  } | null>(null);

  useFrame(() => {
    if (!decalHostRef.current || !planeMesh) return;
    decalHostRef.current.position.copy(planeMesh.position);
    decalHostRef.current.rotation.copy(planeMesh.rotation);
    decalHostRef.current.scale.copy(planeMesh.scale);
  });

  // Compute decal transform from mesh bounding box
  useEffect(() => {
    if (!planeMesh) return;

    const geometry = planeMesh.geometry;
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    if (!box) return;

    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);

    setDecalTransform({
      position: [center.x, center.y, center.z + 0.001],
      scale: [size.x, size.y, size.z || 0.01],
    });
  }, [planeMesh, planeMesh?.geometry]);

  useEffect(() => {
    if (!manager.imageUrl) { setTexture(null); return; }
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      manager.imageUrl,
      (loadedTexture) => {
        if (!active) { loadedTexture.dispose(); return; }
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        setTexture(loadedTexture);
      },
      undefined,
      () => { if (active) setTexture(null); },
    );
    return () => { active = false; };
  }, [manager, manager.imageUrl]);

  useEffect(() => {
    return () => { texture?.dispose(); };
  }, [texture]);

  return (
    <group>
      {planeMesh && (
        <mesh ref={decalHostRef} geometry={planeMesh.geometry}>
          <meshStandardMaterial transparent opacity={0} depthWrite={false} />

          {texture && decalTransform && (
            <Decal
              position={decalTransform.position}
              scale={decalTransform.scale}
              rotation={[0, 0, 0]}
            >
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
