import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as THREE from 'three';
import { useMyTexture } from '../../../../hooks/useMyTexture';
import { useMainContext } from '../../../../hooks/useMainContext';

const Bottom = observer(() => {
  const { design3DManager } = useMainContext();
  const bottom = design3DManager.meshManager.webMeshes.get('bottom');
  const sourceMaterial =
    bottom?.material instanceof THREE.MeshStandardMaterial ||
    bottom?.material instanceof THREE.MeshPhysicalMaterial
      ? bottom.material
      : null;

  const baseColorMap = useMyTexture('/assets/texture/texture/bottomBasecolor.jpg');
  const normalMap = useMyTexture('/assets/texture/texture/bottomNormal.jpg');
  const metallicMap = useMyTexture('/assets/texture/texture/bottomMetallic.jpg');
  const roughnessMap = useMyTexture('/assets/texture/texture/bottomRoughness.jpg');

  [baseColorMap, normalMap, metallicMap, roughnessMap].forEach((texture) => {
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
