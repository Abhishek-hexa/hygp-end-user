import { observer } from 'mobx-react-lite';
import * as THREE from 'three';

import { useWebbingTexture } from '../../../../hooks/useWebbingTexture';
import { TextSize } from '../../../../state/product/types';

export interface WebbingTextProps {
  mesh: THREE.Mesh | undefined;
  text: string;
  fontUrl?: string;
  fontFamilyFallback?: string;
  color?: string;
  fontSize?: TextSize;
  side?: boolean;
}

export const WebbingText = observer(
  ({
    mesh,
    text,
    fontUrl,
    fontFamilyFallback = 'Arial',
    color = '#ffffff',
    fontSize = 'MEDIUM',
    side = false,
  }: WebbingTextProps) => {
    const { texture, envMap } = useWebbingTexture({
      color,
      fontFamilyFallback,
      fontSize,
      fontUrl,
      mesh,
      text,
    });

    if (!mesh || !texture) return null;

    return (
      <group>
        <mesh
          geometry={mesh.geometry}
          position={mesh.position}
          rotation={mesh.rotation}
          scale={mesh.scale}>
          <meshPhysicalMaterial
            map={texture}
            transparent
            depthWrite={false}
            polygonOffset
            polygonOffsetFactor={-1}
            roughness={0.8}
            metalness={1}
            envMap={envMap}
            envMapIntensity={envMap ? 6.5 : 1}
            side={side ? THREE.DoubleSide : THREE.FrontSide}
          />
        </mesh>
      </group>
    );
  },
);

export default WebbingText;
