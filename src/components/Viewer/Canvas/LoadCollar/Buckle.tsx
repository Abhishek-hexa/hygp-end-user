import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useMainContext } from '../../../../hooks/useMainContext';
import { applyBuckleMaterial } from '../materialUtils';

// Component

export const Buckle = observer(() => {
  const { design3DManager, designManager } = useMainContext();
  const { meshManager } = design3DManager;
  const buckleManager = designManager.productManager.buckleManager;
  const selectedHex = buckleManager.currentSelectedColorDescription?.hex;
  const selectedMaterial = buckleManager.material;

  useEffect(() => {
    if (!selectedHex || !selectedMaterial) return;

    meshManager.buckleMeshes.forEach((mesh) => {
      applyBuckleMaterial(mesh, selectedMaterial, selectedHex);
    });
  }, [meshManager.buckleMeshes, selectedHex, selectedMaterial]);

  return (
    <>
      {meshManager.buckleMeshes.map((mesh) => (
        <primitive key={mesh.uuid} object={mesh} />
      ))}
    </>
  );
});
