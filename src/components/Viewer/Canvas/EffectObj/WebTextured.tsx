import { observer } from 'mobx-react-lite';
import * as THREE from 'three';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MeshName } from '../../../../state/design3d/managers/meshNames';
import TextureObj from './TextureObj';

interface WebTexturedProps {
  texturedName: MeshName;
}

const WebTextured = observer(({ texturedName }: WebTexturedProps) => {
  const { designManager, design3DManager } = useMainContext();
  const { productManager } = designManager;
  const { meshManager } = design3DManager;

  const webMesh = meshManager.webMeshes.get(texturedName);
  const selectedPattern = productManager.textureManager.selectedPattern;
  const texturePath = selectedPattern?.pngImage;
  const dataX = selectedPattern?.dataX;
  const currentSize = productManager.sizeManager.selectedSizeData?.size;
  const productKey = productManager.productId;

  if (!webMesh || !texturePath || !dataX || !currentSize) {
    return null;
  }

  const sourceMaterial =
    webMesh.material instanceof THREE.MeshStandardMaterial ||
    webMesh.material instanceof THREE.MeshPhysicalMaterial
      ? webMesh.material
      : null;

  return (
    <TextureObj
      mesh={webMesh}
      texturePath={texturePath}
      dataX={dataX}
      currentSize={currentSize}
      productKey={productKey}
      envMap={sourceMaterial?.envMap ?? null}
    />
  );
});

export default WebTextured;
