import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';

export const Stitches = observer(() => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;

  return (
    <>
      {meshManager.stitchMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
});
