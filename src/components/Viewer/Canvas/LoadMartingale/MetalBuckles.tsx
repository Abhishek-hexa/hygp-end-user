import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';
import { toJS } from 'mobx';

const MetalBuckles = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const selectedColor =
    designManager.productManager.buckleManager.currentSelectedColorDescription
      ?.hex;

  const dRing = design3DManager.meshManager.buckleMeshes.get('D_Ring');
  const triGlide1 = design3DManager.meshManager.buckleMeshes.get('Tri_Glide');
  const triGlide2 = design3DManager.meshManager.buckleMeshes.get('Tri_Glide1');
  const triGlide3 = design3DManager.meshManager.buckleMeshes.get('Tri_Glide2');
  return (
    <>
      {dRing && <MetalObj mesh={dRing} metalColor={selectedColor} />}
      {triGlide1 && <MetalObj mesh={triGlide1} metalColor={selectedColor} />}
      {triGlide2 && <MetalObj mesh={triGlide2} metalColor={selectedColor} />}
      {triGlide3 && <MetalObj mesh={triGlide3} metalColor={selectedColor} />}
    </>
  );
});

export default MetalBuckles;
