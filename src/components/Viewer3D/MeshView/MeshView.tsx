import { observer } from 'mobx-react-lite';

import { MeshInfo } from '../../../core/MeshInfo';
import { useClick } from '../../../hooks/useClick';
import { Logger } from '../../../utils/Logger';
import { SingleMesh } from '../SingleMesh/SingleMesh';

export const MeshView = observer(({ meshInfo }: { meshInfo: MeshInfo }) => {
  const mesh = meshInfo.item;

  const handler = useClick({
    isSelectable: true,

    onHoverStateChanged: (hovered) => {
      Logger.log(`${mesh.name} hovered: ${hovered}`);
    },

    onSelected: () => {
      Logger.log(`${mesh.name} clicked`);
    },
  });

  return (
    <group {...handler.listeners}>
      <SingleMesh
        key={mesh.name}
        {...mesh}
        ukey={mesh.name}
        mainMeshVisible={meshInfo.isVisible}>
        <mesh
          key={mesh.name}
          material={mesh.material}
          geometry={mesh.geometry}
          position={mesh.position}
        />
      </SingleMesh>
    </group>
  );
});
