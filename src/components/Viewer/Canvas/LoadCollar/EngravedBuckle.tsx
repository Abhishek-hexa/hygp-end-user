import { Decal } from '@react-three/drei';
import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../../hooks/useMainContext';
import { useMyTexture } from '../../../../hooks/useMyTexture';

export const EngravedBuckle = observer(function EngravedBuckle() {
  const { designManager, design3DManager } = useMainContext();
  const { engraving3Dmanager } = design3DManager;
  const { decalTransform, planeMesh } = engraving3Dmanager;

  const texture = useMyTexture(engraving3Dmanager.imageUrl, { trackLoading: false });
  const decalTexture = engraving3Dmanager.prepareDecalTexture(texture);

  if (!planeMesh) return null;

  return (
    <group>
      <mesh
        geometry={planeMesh.geometry}
        position={planeMesh.position}
        rotation={planeMesh.rotation}
        scale={planeMesh.scale}
        visible={designManager.productManager.buckleManager.isMetal}
      >
        <meshStandardMaterial transparent opacity={0} depthWrite={false} />

        {decalTexture && decalTransform && (
          <Decal
            position={decalTransform.position}
            scale={decalTransform.scale}
            rotation={[0, 0, 0]}
          >
            <meshBasicMaterial
              map={decalTexture}
              transparent
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>
        )}
      </mesh>
    </group>
  );
});
