import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { CanvasPanel } from './CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';
import { initializeDogCollarApis } from '../../api/initializeDogCollarApis';

export const Viewer = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    void initializeDogCollarApis(productManager);
  }, [productManager]);

  return (
    <div className="h-screen w-full bg-white pt-20">
      <NavBar />
      <div className="grid h-full w-full grid-cols-10">
        <div className="col-span-7 min-h-0">
          <CanvasPanel />
        </div>
        <div className="col-span-3 min-h-0">
          <ConfigurationPanel />
        </div>
      </div>
    </div>
  );
});
