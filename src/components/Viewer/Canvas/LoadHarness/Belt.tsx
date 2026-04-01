import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';

const Belt = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const belts = design3DManager.meshManager.beltsMesh;
  const selectedColor =
    designManager.productManager.buckleManager.currentSelectedColorDescription
      ?.hex;
  const sourceMaterial =
    belts?.material instanceof THREE.MeshStandardMaterial ||
    belts?.material instanceof THREE.MeshPhysicalMaterial
      ? belts.material
      : null;

  const beltNormalMap = useMyTexture('/assets/texture/texture/beltNormal.webp');
  if (beltNormalMap) {
    beltNormalMap.flipY = false;
  }

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColor),
      envMap: sourceMaterial?.envMap ?? null,
      envMapIntensity: sourceMaterial?.envMap ? 6.5 : 0,
      metalness: 1,
      normalMap: beltNormalMap,
      normalScale: new THREE.Vector2(30.5, -30.5),
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    mat.needsUpdate = true;
    return mat;
  }, [beltNormalMap, sourceMaterial]);

  if (!belts) {
    return null;
  }

  return (
    <mesh
      key={belts.uuid}
      geometry={belts.geometry}
      material={material}
      position={belts.position}
      rotation={belts.rotation}
      scale={belts.scale}
    />
  );
});

export default Belt;
