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

  const selectedPlasticColor =
    designManager.productManager.buckleManager.plasticColorDescription?.hex;

  return (
    <>
      {meshManager.aLinkMesh && selectedColor && (
        <MetalObj
          key={meshManager.aLinkMesh.uuid}
          mesh={meshManager.aLinkMesh}
          metalColor={'#fff'}
        />
      )}
      {meshManager.dLinkMesh && selectedColor && (
        <MetalObj
          key={meshManager.dLinkMesh.uuid}
          mesh={meshManager.dLinkMesh}
          metalColor={'#fff'}
        />
      )}
      {meshManager.buckle1Mesh && selectedColor && (
        <PlasticObj
          key={meshManager.buckle1Mesh.uuid}
          mesh={meshManager.buckle1Mesh}
          color={selectedPlasticColor}
        />
      )}
      {meshManager.buckle2Mesh && selectedColor && (
        <PlasticObj
          key={meshManager.buckle2Mesh.uuid}
          mesh={meshManager.buckle2Mesh}
          color={selectedPlasticColor}
        />
      )}
      {meshManager.triGlide1Mesh && selectedColor && (
        <PlasticObj
          key={meshManager.triGlide1Mesh.uuid}
          mesh={meshManager.triGlide1Mesh}
          color={selectedPlasticColor}
        />
      )}
      {meshManager.triGlide2Mesh && selectedColor && (
        <PlasticObj
          key={meshManager.triGlide2Mesh.uuid}
          mesh={meshManager.triGlide2Mesh}
          color={selectedPlasticColor}
        />
      )}
      {meshManager.glassSmallMesh && selectedColor && (
        <GlassObj
          key={meshManager.glassSmallMesh.uuid}
          mesh={meshManager.glassSmallMesh}
        />
      )}
    </>
  );
});

export default BuckleGroup;
