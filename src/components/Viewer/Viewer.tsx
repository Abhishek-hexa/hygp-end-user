import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../hooks/useMainContext';
import { usePreloadOther } from '../../hooks/viewerHook/usePreloadOther';
import { useDefaults } from '../../hooks/viewerHook/useDefaults';
import { usePatternSync } from '../../hooks/viewerHook/usePatternSync';
import { useProductInit } from '../../hooks/viewerHook/useProductInit';
import CustomLoader from '../shared/CustomLoader';
import { CanvasLoadingOverlay } from './Canvas/CanvasLoadingOverlay';
import { CanvasPanel } from './Canvas/CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';

export const Viewer = observer(() => {
  useDefaults();
  usePreloadOther();

  const { uiManager } = useMainContext();
  useProductInit();
  usePatternSync();

  return (
    <>
      <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_clamp(320px,35vw,600px)] max-lg:grid-cols-1 max-lg:grid-rows-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <div className="relative min-h-0 min-w-0">
          <CanvasPanel />
          {uiManager.is3DLoading ? <CanvasLoadingOverlay /> : null}
        </div>

        <div className="min-h-0 min-w-0 w-full">
          <ConfigurationPanel />
        </div>
      </div>
      {uiManager.isDataLoading || uiManager.is3DLoading ? (
        <CustomLoader />
      ) : null}
      {uiManager.dataError ? (
        <div className="pointer-events-none absolute inset-x-4 top-20 z-20 flex justify-center">
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
            {uiManager.dataError}
          </div>
        </div>
      ) : null}
    </>
  );
});
