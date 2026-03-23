import { observer } from 'mobx-react-lite';
import * as THREE from 'three';
import { useMainContext } from '../../../../hooks/useMainContext';
import TextureObj from '../EffectObj/TextureObj';

interface WebMeshProps {
  mesh: THREE.Mesh;
  texturePath: string;
  dataX: string;
  currentSize: string;
  productKey: string;
}

const WebMesh = ({
  mesh,
  texturePath,
  dataX,
  currentSize,
  productKey,
}: WebMeshProps) => {
  const sourceMaterial =
    mesh.material instanceof THREE.MeshStandardMaterial ||
    mesh.material instanceof THREE.MeshPhysicalMaterial
      ? mesh.material
      : null;

  return (
    <TextureObj
      mesh={mesh}
      texturePath={texturePath}
      dataX={dataX}
      currentSize={currentSize}
      productKey={productKey}
      envMap={sourceMaterial?.envMap ?? null}
    />
  );
};

export const Web = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { productManager } = designManager;

  const webMesh = meshManager.webMeshes.get('Leash');
  const selectedPattern = productManager.textureManager.selectedPattern;
  const texturePath = selectedPattern?.pngImage;
  const dataX = selectedPattern?.dataX;
  const currentSize = productManager.sizeManager.selectedSizeData?.size;
  const productKey = productManager.productId;

  if (!webMesh || !texturePath || !dataX || !currentSize) {
    return null;
  }

  return (
    <WebMesh
      mesh={webMesh}
      texturePath={texturePath}
      dataX={dataX}
      currentSize={currentSize}
      productKey={productKey}
    />
  );
});
