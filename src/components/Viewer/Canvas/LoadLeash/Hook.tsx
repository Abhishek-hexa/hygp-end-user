import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';

const Hook = observer(({}) => {
  const { designManager, design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;
  const hook = meshManager.buckleMeshes.get('Hook');
  const selectedColor =
    designManager.productManager.buckleManager.currentSelectedColorDescription
      ?.hex;
  return <>{hook && <MetalObj mesh={hook} metalColor={selectedColor} />}</>;
});

export default Hook;
