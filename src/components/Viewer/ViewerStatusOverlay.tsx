import { observer } from 'mobx-react-lite';

import { useMainContext } from '../../hooks/useMainContext';
import CustomLoader from '../shared/CustomLoader';

export const ViewerStatusOverlay = observer(() => {
  const { uiManager } = useMainContext();

  return (
    <>
      {uiManager.isDataLoading || uiManager.is3DLoading ? <CustomLoader /> : null}
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
