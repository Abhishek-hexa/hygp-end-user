import { ReactNode, useRef } from 'react';

import { StateManager } from '../state/StateManager';
import { MainContext } from './MainContext';

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const stateManagerRef = useRef<StateManager | null>(null);

  if (!stateManagerRef.current) {
    stateManagerRef.current = new StateManager();
  }

  return (
    <MainContext.Provider value={stateManagerRef.current}>
      {children}
    </MainContext.Provider>
  );
};
