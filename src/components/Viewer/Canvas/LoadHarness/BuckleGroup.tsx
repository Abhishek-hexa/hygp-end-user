import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { MetalObj } from '../EffectObj/MetalObj';
import { PlasticObj } from '../EffectObj/PlasticObj';
import { GlassObj } from '../EffectObj/GlassObj';

const BuckleGroup = observer(() => {
  const { designManager, design3DManager } = useMainContext();
  const meshManager = design3DManager.meshManager;
  const selectedColor =
    designManager.productManager.buckleManager.currentSelectedColorDescription
      ?.hex;

  const selectedPlasticColor = designManager.productManager.buckleManager.plasticColorDescription?.hex;

  const aLink = meshManager.buckleMeshes.get('aLink');
  const dLink = meshManager.buckleMeshes.get('dLink');
  const buckle1 = meshManager.buckleMeshes.get('buckle1');
  const buckle2 = meshManager.buckleMeshes.get('buckle2');
  const triGlide1 = meshManager.buckleMeshes.get('triGlide1');
  const triGlide2 = meshManager.buckleMeshes.get('triGlide2');
  const glass = meshManager.buckleMeshes.get('glass');

  return (
    <>
      {aLink && selectedColor && (
        <MetalObj key={aLink.uuid} mesh={aLink} metalColor={'#fff'} />
      )}
      {dLink && selectedColor && (
        <MetalObj key={dLink.uuid} mesh={dLink} metalColor={'#fff'} />
      )}
      {buckle1 && selectedColor && (
        <PlasticObj key={buckle1.uuid} mesh={buckle1} color={selectedPlasticColor} />
      )}
      {buckle2 && selectedColor && (
        <PlasticObj key={buckle2.uuid} mesh={buckle2} color={selectedPlasticColor} />
      )}
      {triGlide1 && selectedColor && (
        <PlasticObj
          key={triGlide1.uuid}
          mesh={triGlide1}
          color={selectedPlasticColor}
        />
      )}
      {triGlide2 && selectedColor && (
        <PlasticObj
          key={triGlide2.uuid}
          mesh={triGlide2}
          color={selectedPlasticColor}
        />
      )}
      {glass && selectedColor && <GlassObj key={glass.uuid} mesh={glass} />}
    </>
  );
});

export default BuckleGroup;
