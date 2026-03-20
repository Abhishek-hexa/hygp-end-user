import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { toJS } from 'mobx';

export const Buckle = observer(() => {
  const { design3DManager, designManager } = useMainContext();
  const { meshManager } = design3DManager;
  const buckleManager = designManager.productManager.buckleManager;

  console.log(buckleManager.selectedColor)
  console.log(buckleManager.material)
  console.log(toJS(buckleManager.currentColors))


  return (
    <>
      {meshManager.buckleMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
});
