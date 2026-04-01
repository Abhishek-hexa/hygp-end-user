import * as THREE from 'three';

import {
  useTextureObject,
  type UseTextureObjectOptions,
} from '../../../../hooks/useTextureObject';

export type TextureMeshInput = THREE.Mesh | THREE.BufferGeometry;

interface TextureObjProps extends UseTextureObjectOptions {
  mesh: TextureMeshInput | TextureMeshInput[];
}

const TextureObj = (props: TextureObjProps) => {
  const { mesh, ...hookOptions } = props;
  const material = useTextureObject(hookOptions);

  const meshList = Array.isArray(mesh) ? mesh : [mesh];

  return (
    <>
      {meshList.map((entry, i) =>
        entry instanceof THREE.Mesh ? (
          <mesh
            key={`${entry.uuid}-${i}`}
            geometry={entry.geometry}
            material={material}
            position={entry.position}
            rotation={entry.rotation}
            scale={entry.scale}
          />
        ) : (
          <mesh key={i} geometry={entry} material={material} />
        ),
      )}
    </>
  );
};

export default TextureObj;
