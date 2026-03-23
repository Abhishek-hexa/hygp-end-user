import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useMainContext } from '../../../../hooks/useMainContext';

const Belt = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const belts = design3DManager.meshManager.webMeshes.get('belts');
  const selectedColor = designManager.productManager.buckleManager.currentSelectedColorDescription?.hex;
  const sourceMaterial =
    belts?.material instanceof THREE.MeshStandardMaterial ||
    belts?.material instanceof THREE.MeshPhysicalMaterial
      ? belts.material
      : null;

  const beltNormalMap = useLoader(
    THREE.TextureLoader,
    '/assets/texture/texture/beltNormal.jpg',
  );
  beltNormalMap.flipY = false;
  beltNormalMap.wrapS = THREE.RepeatWrapping;
  beltNormalMap.wrapT = THREE.RepeatWrapping;
  beltNormalMap.repeat.set(5, 5);

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(selectedColor),
      roughness: 0.8,
      metalness: 1,
      normalMap: beltNormalMap,
      normalScale: new THREE.Vector2(30.5, -30.5),
      envMap: sourceMaterial?.envMap ?? null,
      envMapIntensity: sourceMaterial?.envMap ? 6.5 : 0,
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
