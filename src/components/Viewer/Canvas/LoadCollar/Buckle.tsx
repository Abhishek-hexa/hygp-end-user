import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../../hooks/useMainContext';
import { BreakAwayObj } from '../EffectObj/BreakAwayObj';
import { GlassObj } from '../EffectObj/GlassObj';
import { MetalObj } from '../EffectObj/MetalObj';
import { PlasticObj } from '../EffectObj/PlasticObj';

// Component

export const Buckle = observer(() => {
  const { design3DManager, designManager } = useMainContext();
  const { meshManager } = design3DManager;
  const { productManager } = designManager;
  const buckleManager = productManager.buckleManager;
  const isCatCollar = productManager.productId === 'CAT_COLLAR';
  const selectedMetalHex = buckleManager.currentMetalColor?.hex;
  const selectedPlasticColor = buckleManager.plasticColorDescription?.hex;
  const selectedMaterial = buckleManager.material;

  return (
    <>
      {meshManager.buckleMesh && selectedMaterial !== 'BREAKAWAY' && (
        selectedMaterial === 'METAL' ? (
          <MetalObj
            key={meshManager.buckleMesh.uuid}
            mesh={meshManager.buckleMesh}
            metalColor={selectedMetalHex ?? '#aaaaaa'}
          />
        ) : (
          <PlasticObj
            key={meshManager.buckleMesh.uuid}
            mesh={meshManager.buckleMesh}
            color={selectedPlasticColor}
          />
        )
      )}
      {meshManager.catBuckleMesh && selectedMaterial === 'BREAKAWAY' && (
        <BreakAwayObj
          key={meshManager.catBuckleMesh.uuid}
          mesh={meshManager.catBuckleMesh}
          breakawayColor={'#000'}
        />
      )}
      {meshManager.dRingMesh && (
        <MetalObj
          key={meshManager.dRingMesh.uuid}
          mesh={meshManager.dRingMesh}
          metalColor={selectedMetalHex ?? '#aaaaaa'}
        />
      )}
      {meshManager.triGlideMesh && (selectedMaterial === 'METAL' || isCatCollar) && (
        <MetalObj
          key={meshManager.triGlideMesh.uuid}
          mesh={meshManager.triGlideMesh}
          metalColor={selectedMetalHex ?? '#aaaaaa'}
        />
      )}
      {meshManager.triGlideMesh && selectedMaterial !== 'METAL' && !isCatCollar && (
        <PlasticObj
          key={meshManager.triGlideMesh.uuid}
          mesh={meshManager.triGlideMesh}
          color={selectedPlasticColor}
        />
      )}
      {meshManager.glassMesh && (
        <GlassObj
          key={meshManager.glassMesh.uuid}
          mesh={meshManager.glassMesh}
        />
      )}
      {meshManager.planeMesh && <primitive key={meshManager.planeMesh.uuid} object={meshManager.planeMesh} />}
    </>
  );
});
