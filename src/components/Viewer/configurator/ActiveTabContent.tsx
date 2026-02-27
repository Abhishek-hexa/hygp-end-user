import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { BuckleTab } from './tabs/BuckleTab';
import { CollarTextTab } from './tabs/CollarTextTab';
import { DesignTab } from './tabs/DesignTab';
import { EngravingTab } from './tabs/EngravingTab';
import { FetchTab } from './tabs/FetchTab';
import { HardwareTab } from './tabs/HardwareTab';
import { SizeTab } from './tabs/SizeTab';

export const ActiveTabContent = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  if (productManager.activeTab === 'size') return <SizeTab />;
  if (productManager.activeTab === 'select-design') return <DesignTab />;
  if (productManager.activeTab === 'buckle') return <BuckleTab />;
  if (productManager.activeTab === 'hardware') return <HardwareTab />;
  if (productManager.activeTab === 'engraving') return <EngravingTab />;
  if (productManager.activeTab === 'collar-text') return <CollarTextTab />;
  if (productManager.activeTab === 'fetch') return <FetchTab />;
  return null;
});
