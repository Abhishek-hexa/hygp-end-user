import { observer } from 'mobx-react-lite';

import { useHYGP } from '../../hooks/useHYGP';
import { useMainContext } from '../../hooks/useMainContext';
import { useBulkMode } from '../../hooks/viewerHook/useBulkMode';
import { useProductInit } from '../../hooks/viewerHook/useProductInit';
import { usePatternSync } from '../../hooks/viewerHook/usePatternSync';
import CustomLoader from '../shared/CustomLoader';
import { CanvasPanel } from './Canvas/CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  useHYGP();

  const { uiManager } = useMainContext();
  const isBulkMode = useBulkMode();
  useProductInit();
  usePatternSync();

  return (
    <div
      className={`relative h-dvh w-full bg-white ${
        isBulkMode ? 'pt-24 lg:pt-28' : 'pt-16 lg:pt-20'
      }`}>
      <NavBar />
      <div className="grid h-full w-full grid-cols-[minmax(0,1fr)_clamp(320px,35vw,600px)] max-lg:grid-cols-1 max-lg:grid-rows-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <div className="min-h-0 min-w-0">
          <CanvasPanel />
        </div>

        <div className="min-h-0 min-w-0 w-full">
          <ConfigurationPanel />
        </div>
      </div>
      {uiManager.isDataLoading || uiManager.is3DLoading ? <CustomLoader /> : null}
      {uiManager.dataError ? (
        <div className="pointer-events-none absolute inset-x-4 top-20 z-20 flex justify-center">
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 shadow-sm">
            {uiManager.dataError}
          </div>
        </div>
      ) : null}
    </div>
  );
});
