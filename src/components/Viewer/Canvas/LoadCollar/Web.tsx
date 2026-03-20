import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';

export const Web = observer(() => {
  const { design3DManager } = useMainContext();
  const { meshManager } = design3DManager;

  return (
    <>
      {meshManager.webMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
});
