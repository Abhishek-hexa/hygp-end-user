import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';
import { toJS } from 'mobx';

const MetalBuckles = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const selectedColor =
    designManager.productManager.buckleManager.currentMetalColor?.hex;

  return (
    <>
      {design3DManager.meshManager.dRingMesh && <MetalObj mesh={design3DManager.meshManager.dRingMesh} metalColor={selectedColor} />}
      {design3DManager.meshManager.triGlideMesh && <MetalObj mesh={design3DManager.meshManager.triGlideMesh} metalColor={selectedColor} />}
      {design3DManager.meshManager.triGlide1UpperMesh && <MetalObj mesh={design3DManager.meshManager.triGlide1UpperMesh} metalColor={selectedColor} />}
      {design3DManager.meshManager.triGlide2UpperMesh && <MetalObj mesh={design3DManager.meshManager.triGlide2UpperMesh} metalColor={selectedColor} />}
    </>
  );
});

export default MetalBuckles;
