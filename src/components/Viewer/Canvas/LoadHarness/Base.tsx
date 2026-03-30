import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';

const Base = observer(() => {
  const { design3DManager } = useMainContext();
  const base = design3DManager.meshManager.webMeshes.get('base2');
  const sourceMaterial =
    base?.material instanceof THREE.MeshStandardMaterial ||
    base?.material instanceof THREE.MeshPhysicalMaterial
      ? base.material
      : null;

  const normalMap = useMyTexture('/assets/texture/texture/base2Normal.webp');
  if (normalMap) {
    normalMap.flipY = false;
  }

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#000000'),
      envMap: sourceMaterial?.envMap ?? null,
      envMapIntensity: sourceMaterial?.envMap ? 6.5 : 0,
      metalness: 0.5,
      normalMap,
      normalScale: new THREE.Vector2(30.5, -30.5),
      roughness: 1,
      side: THREE.DoubleSide,
      toneMapped: false,
    });
    mat.needsUpdate = true;
    return mat;
  }, [normalMap, sourceMaterial]);

  if (!base) {
    return null;
  }

  return (
    <mesh
      key={base.uuid}
      geometry={base.geometry}
      material={material}
      position={base.position}
      rotation={base.rotation}
      scale={base.scale}
    />
  );
});

export default Base;
