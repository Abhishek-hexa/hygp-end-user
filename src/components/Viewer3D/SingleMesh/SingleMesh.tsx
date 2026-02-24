import { MeshProps } from '@react-three/fiber';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import * as THREE from 'three';

export const SingleMesh = observer(
  (
    props: MeshProps & {
      ukey: string;
      mainMeshVisible: boolean;
    },
  ) => {
    const mainMeshVisible = props.mainMeshVisible;

    const material = useMemo(
      () => props.material || new THREE.MeshStandardMaterial(),
      [props.material],
    );

    return (
      <>
        {/* Original mesh */}
        <mesh
          key={`single-mesh-${props.ukey}`}
          {...props}
          visible={mainMeshVisible}
          material={material}
        />
      </>
    );
  },
);
