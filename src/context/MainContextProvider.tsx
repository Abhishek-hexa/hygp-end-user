import { ReactNode, useState } from 'react';

import { StateManager } from '../state/StateManager';
import { MainContext } from './MainContext';

export const MainContextProvider = ({ children }: { children: ReactNode }) => {
  const [stateManager] = useState(() => new StateManager());

  return (
    <MainContext.Provider value={stateManager}>
      {children}
    </MainContext.Provider>
  );
};
