import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { resolveTabsForProduct } from './constants';

export const TabBar = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;
  const tabs = resolveTabsForProduct(productManager);

  return (
    <div className="flex min-w-max flex-row gap-1">
      {tabs.map((tab) => {
        const selected = tab.id === productManager.activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => productManager.setActiveTab(tab.id)}
            className="whitespace-nowrap rounded-full border px-2 py-1 uppercase"
            style={{
              backgroundColor: selected ? '#EE8F90' : 'transparent',
              borderColor: selected ? '#EE8F90' : '#B8CCC5',
              color: selected ? 'white' : '#6E8D84',
              fontWeight: 700,
            }}>
            {tab.label}
          </button>
        );
      })}
    </div>
  );
});
