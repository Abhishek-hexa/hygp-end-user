import { Decal } from '@react-three/drei';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';


export const EngravedBuckle = observer(function EngravedMesh() {
  const { design3DManager } = useMainContext();
  const manager = design3DManager.engraving3Dmanager;
  const texture = useMyTexture(manager.imageUrl);
  const [decalTransform, setDecalTransform] = useState<{
    position: [number, number, number];
    scale: [number, number, number];
  } | null>(null);
  const planeMesh = design3DManager.meshManager.planeMesh;

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
    if (!texture) return;
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <group>
      {planeMesh && (
        <mesh
          geometry={planeMesh.geometry}
          position={planeMesh.position}
          rotation={planeMesh.rotation}
          scale={design3DManager.meshManager.planeMesh.scale}>
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
