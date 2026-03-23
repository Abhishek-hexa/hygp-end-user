import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { useMainContext } from '../../../../hooks/useMainContext';

const Bottom = observer(() => {
  const { design3DManager } = useMainContext();
  const bottom = design3DManager.meshManager.webMeshes.get('bottom');
  const sourceMaterial =
    bottom?.material instanceof THREE.MeshStandardMaterial ||
    bottom?.material instanceof THREE.MeshPhysicalMaterial
      ? bottom.material
      : null;

  const [baseColorMap, normalMap, metallicMap, roughnessMap] = useLoader(
    THREE.TextureLoader,
    [
      '/assets/texture/texture/bottomBasecolor.jpg',
      '/assets/texture/texture/bottomNormal.jpg',
      '/assets/texture/texture/bottomMetallic.jpg',
      '/assets/texture/texture/bottomRoughness.jpg',
    ],
  );

  [baseColorMap, normalMap, metallicMap, roughnessMap].forEach((texture) => {
    texture.flipY = false;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
  });
  baseColorMap.colorSpace = THREE.SRGBColorSpace;

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8e8e8'),
      map: baseColorMap,
      normalMap,
      normalScale: new THREE.Vector2(30.5, -30.5),
      metalnessMap: metallicMap,
      roughnessMap,
      roughness: 1,
      metalness: 0,
      envMap: sourceMaterial?.envMap ?? null,
      side: THREE.DoubleSide,
    });
    mat.needsUpdate = true;
    return mat;
  }, [baseColorMap, normalMap, metallicMap, roughnessMap, sourceMaterial]);

  if (!bottom) {
    return null;
  }

  return (
    <mesh
      key={bottom.uuid}
      geometry={bottom.geometry}
      material={material}
      position={bottom.position}
      rotation={bottom.rotation}
      scale={bottom.scale}
    />
  );
});

export default Bottom;
