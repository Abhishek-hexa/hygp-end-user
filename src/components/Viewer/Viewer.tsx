import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { initializeDogCollarApis } from './initializeDogCollarApis';
import { CanvasPanel } from './CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  const mainContext = useMainContext();
  const designManager = mainContext.designManager;
  const productManager = designManager.productManager;
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (hasInitializedRef.current) {
      return;
    }

    hasInitializedRef.current = true;
    void initializeDogCollarApis(productManager);
  }, [productManager]);

  return (
    <div className="h-screen w-full bg-white">
      <NavBar />
      <div className="mt-20 grid h-[calc(100vh-80px)] w-full grid-cols-[70%_30%]">
        <CanvasPanel />
        <ConfigurationPanel />
      </div>
    </div>
  );
});
