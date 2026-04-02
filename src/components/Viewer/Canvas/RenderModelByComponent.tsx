import { observer } from 'mobx-react-lite';
import { useMainContext } from '../../../hooks/useMainContext';
import { LoadCollar } from './LoadCollar/LoadCollar';
import LoadLeash from './LoadLeash/LoadLeash';
import LoadBandana from './LoadBandana/LoadBandana';
import LoadHarness from './LoadHarness/LoadHarness';
import LoadMartingale from './LoadMartingale/LoadMartingale';

const RenderModelByComponent = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;
  const modelUrl = designManager.productManager.modelPath;
  const plasticModelUrl = productManager.plasticModelPath;

  if (!modelUrl) {
    return null;
  }

  switch (productManager.productId) {
    case 'DOG_COLLAR':
    case 'CAT_COLLAR':
      return (
        plasticModelUrl && (
          <LoadCollar url={modelUrl} plasticUrl={plasticModelUrl} />
        )
      );
    case 'LEASH':
      return <LoadLeash url={modelUrl} />;
    case 'BANDANA':
      return <LoadBandana url={modelUrl} />;
    case 'HARNESS':
      return <LoadHarness url={modelUrl} />;
    case 'MARTINGALE':
      return <LoadMartingale url={modelUrl} />;
    default:
      return null;
  }
});

export default RenderModelByComponent;
