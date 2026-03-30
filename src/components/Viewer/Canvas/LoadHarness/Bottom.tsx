import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as THREE from 'three';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';

const Bottom = observer(() => {
  const { design3DManager } = useMainContext();
  const bottom = design3DManager.meshManager.webMeshes.get('bottom');
  const sourceMaterial =
    bottom?.material instanceof THREE.MeshStandardMaterial ||
    bottom?.material instanceof THREE.MeshPhysicalMaterial
      ? bottom.material
      : null;

  const baseColorMap = useMyTexture(
    '/assets/texture/texture/bottomBasecolor.webp',
  );
  const normalMap = useMyTexture('/assets/texture/texture/bottomNormal.webp');
  const metallicMap = useMyTexture(
    '/assets/texture/texture/bottomMetallic.webp',
  );

  [baseColorMap, normalMap, metallicMap].forEach((texture) => {
    if (texture) {
      texture.flipY = false;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(5, 5);
    }
  });
  if (baseColorMap) baseColorMap.colorSpace = THREE.SRGBColorSpace;

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#e8e8e8'),
      envMap: sourceMaterial?.envMap ?? null,
      map: baseColorMap,
      metalness: 0,
      metalnessMap: metallicMap,
      normalMap,
      normalScale: new THREE.Vector2(30.5, -30.5),
      roughness: 1,
      side: THREE.DoubleSide,
    });
    mat.needsUpdate = true;
    return mat;
  }, [baseColorMap, normalMap, metallicMap, sourceMaterial]);

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
