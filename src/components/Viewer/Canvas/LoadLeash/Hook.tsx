import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';

const Hook = observer(({}) => {
  const { designManager, design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;
  const selectedColor =
    designManager.productManager.buckleManager.currentMetalColor
      ?.hex;
  return <>{meshManager.hookMesh && <MetalObj mesh={meshManager.hookMesh} metalColor={selectedColor} side={true} />}</>;
});

export default Hook;
