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
  const selectedHex = buckleManager.currentSelectedColorDescription?.hex;
  const selectedPlasticColor = buckleManager.plasticColorDescription?.hex;
  const selectedMaterial = buckleManager.material;

  const buckleMeshes = meshManager.buckleMeshes;
  const buckleMesh = buckleMeshes.get('Buckle');
  const catBuckleMesh = buckleMeshes.get('Cat_Buckle');
  const dRingMesh = buckleMeshes.get('D_Ring');
  const triGlideMesh = buckleMeshes.get('Tri_Glide');
  const planeMesh = buckleMeshes.get('Plane');
  const glassMesh = buckleMeshes.get('Glass');

  return (
    <>
      {buckleMesh && selectedMaterial !== 'BREAKAWAY' && (
        selectedMaterial === 'METAL' ? (
          <MetalObj
            key={buckleMesh.uuid}
            mesh={buckleMesh}
            metalColor={selectedHex ?? '#aaaaaa'}
          />
        ) : (
          <PlasticObj
            key={buckleMesh.uuid}
            mesh={buckleMesh}
            color={selectedPlasticColor}
          />
        )
      )}
      {catBuckleMesh && selectedMaterial === 'BREAKAWAY' && (
        <BreakAwayObj
          key={catBuckleMesh.uuid}
          mesh={catBuckleMesh}
          breakawayColor={'#000'}
        />
      )}
      {dRingMesh && (
        <MetalObj
          key={dRingMesh.uuid}
          mesh={dRingMesh}
          metalColor={selectedHex ?? '#aaaaaa'}
        />
      )}
      {triGlideMesh && (selectedMaterial === 'METAL' || isCatCollar) && (
        <MetalObj
          key={triGlideMesh.uuid}
          mesh={triGlideMesh}
          metalColor={selectedHex ?? '#aaaaaa'}
        />
      )}
      {triGlideMesh && selectedMaterial !== 'METAL' && !isCatCollar && (
        <PlasticObj
          key={triGlideMesh.uuid}
          mesh={triGlideMesh}
          color={selectedPlasticColor}
        />
      )}
      {glassMesh && (
        <GlassObj
          key={glassMesh.uuid}
          mesh={glassMesh}
        />
      )}
      {planeMesh && <primitive key={planeMesh.uuid} object={planeMesh} />}
    </>
  );
});
