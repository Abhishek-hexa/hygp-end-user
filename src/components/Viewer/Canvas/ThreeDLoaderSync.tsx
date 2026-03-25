import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import { useMainContext } from '../../../hooks/useMainContext';

export function ThreeDLoaderSync() {
  const { active } = useProgress();
  const { uiManager } = useMainContext();
  
  useEffect(() => {
    if (active) {
      uiManager.add3DLoadingItem('drei-progress');
    } else {
      uiManager.remove3DLoadingItem('drei-progress');
    }
  }, [active, uiManager]);
  
  return null;
}
