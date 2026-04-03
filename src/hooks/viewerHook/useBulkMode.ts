import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useMainContext } from '../useMainContext';

export function useBulkMode() {
  const { uiManager } = useMainContext();
  const location = useLocation();
  const lastPathnameRef = useRef<string | null>(null);
  const isBulkPath = /\/bulk(\/|$)/.test(location.pathname);

  useEffect(() => {
    if (lastPathnameRef.current === location.pathname) return;
    lastPathnameRef.current = location.pathname;
    uiManager.setBulkMode(isBulkPath);
  }, [isBulkPath, location.pathname, uiManager]);

  return isBulkPath;
}
