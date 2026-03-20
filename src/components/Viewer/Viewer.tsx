import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { initializeProductApis } from '../../api/initializeProductApis';
import { useMainContext } from '../../hooks/useMainContext';
import {
  buildPatternPath,
  defaultProductSlug,
  productSlugToType,
} from '../../state/product/productRouting';
import CustomLoader from '../shared/CustomLoader';
import { CanvasPanel } from './Canvas/CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const uiManager = mainContext.uiManager;
  const location = useLocation();
  const navigate = useNavigate();
  const { patternID, productSlug } = useParams<{
    patternID?: string;
    productSlug: string;
  }>();
  const selectedProductType = productSlugToType(productSlug);
  const lastInitializedProductSlugRef = useRef<string | null>(null);
  const lastPathnameRef = useRef<string | null>(null);
  const selectedPatternIdFromUrl = parsePatternId(patternID);
  const selectedPatternId = productManager.textureManager.selectedPatternId;
  const isBulkPath = /\/bulk(\/|$)/.test(location.pathname);

  // setting bulk mode on the basis of url
  useEffect(() => {
    if (lastPathnameRef.current === location.pathname) {
      return;
    }
    lastPathnameRef.current = location.pathname;
    uiManager.setBulkMode(isBulkPath);
  }, [isBulkPath, location.pathname, uiManager]);

  // initialization of product APIs
  useEffect(() => {
    if (!selectedProductType) {
      navigate(`/${defaultProductSlug}`, { replace: true });
      return;
    }

    // Avoid re-initializing on pattern-only URL changes.
    if (lastInitializedProductSlugRef.current === productSlug) {
      return;
    }

    lastInitializedProductSlugRef.current = productSlug ?? null;
    void initializeProductApis(
      productManager,
      uiManager,
      selectedProductType,
      selectedPatternIdFromUrl,
    );
  }, [
    navigate,
    productManager,
    productSlug,
    selectedPatternIdFromUrl,
    selectedProductType,
    uiManager,
  ]);

  // syncing url with selected pattern and bulk mode
  useEffect(() => {
    if (!productSlug) {
      return;
    }
    const effectivePatternId = selectedPatternId ?? selectedPatternIdFromUrl;
    if (effectivePatternId === null) {
      return;
    }

    const targetPath = buildPatternPath(
      productSlug,
      effectivePatternId,
      uiManager.isBulkMode,
    );
    if (location.pathname === targetPath) {
      return;
    }

    navigate(targetPath, { replace: true });
  }, [
    location.pathname,
    navigate,
    productSlug,
    selectedPatternId,
    selectedPatternIdFromUrl,
    uiManager.isBulkMode,
  ]);

  return (
    <div
      className={`relative h-dvh w-full bg-white ${
        uiManager.isBulkMode ? 'pt-24 lg:pt-28' : 'pt-16 lg:pt-20'
      }`}>
      <NavBar />
      <div className="grid h-full w-full grid-cols-10 max-lg:grid-cols-1 max-lg:grid-rows-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <div className="col-span-7 min-h-0 max-lg:col-span-1">
          <CanvasPanel />
        </div>
        <div className="col-span-3 min-h-0 max-lg:col-span-1">
          <ConfigurationPanel />
        </div>
      </div>
      {uiManager.isDataLoading ? <CustomLoader /> : null}
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

const parsePatternId = (patternID: string | undefined): number | null => {
  if (!patternID) {
    return null;
  }
  const parsedPatternId = Number.parseInt(patternID, 10);
  return Number.isFinite(parsedPatternId) ? parsedPatternId : null;
};
