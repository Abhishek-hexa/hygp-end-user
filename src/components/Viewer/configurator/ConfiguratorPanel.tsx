import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../../hooks/useMainContext';
import { ActiveTabContent } from './ActiveTabContent';
import { useConfiguratorQueries } from './hooks/useConfiguratorQueries';
import { useConfiguratorSummary } from './hooks/useConfiguratorSummary';
import { useSyncProductManager } from './hooks/useSyncProductManager';
import { TabBar } from './TabBar';

export const ConfiguratorPanel = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;
  const queries = useConfiguratorQueries(productManager);
  useSyncProductManager({ productManager, queries });
  const { hasAnyError, loading } = useConfiguratorSummary(queries);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f7f5]">
      <div className="overflow-x-auto border-b border-[#d8d8d8] p-1.5">
        <TabBar />
      </div>
      <div className="flex-1 overflow-y-auto p-2.5">
        {hasAnyError ? (
          <div
            role="alert"
            className="mb-2 rounded-md border border-[#f5c2c7] bg-[#f8d7da] px-3 py-2 text-sm text-[#842029]">
            {hasAnyError.message}
          </div>
        ) : null}
        {loading ? (
          <div className="mb-2 flex items-center gap-2">
            <div className="h-[18px] w-[18px] animate-spin rounded-full border-2 border-[#88a69c] border-t-transparent" />
            <p className="text-sm">Loading data from backend...</p>
          </div>
        ) : null}
        <ActiveTabContent />
      </div>
    </div>
  );
});
