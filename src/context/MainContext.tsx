import React from 'react';

import { StateManager } from '../state/StateManager';

export const MainContext = React.createContext<StateManager | null>(null);
