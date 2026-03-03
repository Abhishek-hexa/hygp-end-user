import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';

import { useMainContext } from '../../hooks/useMainContext';
import { initializeDogCollarApis } from './initializeDogCollarApis';
import { NavBar } from './NavBar/NavBar';

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
    <div className="h-screen w-full bg-white">
      <NavBar />
      <div className="mt-16 flex h-[calc(100vh-64px)] w-full items-center justify-center text-[#444]">
        3D rendering is temporarily disabled.
      </div>
    </div>
  );
});
