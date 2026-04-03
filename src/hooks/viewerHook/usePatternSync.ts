import { useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  buildPatternPath,
  parsePatternIdParam,
} from '../../state/product/productRouting';
import { useMainContext } from '../useMainContext';

export function usePatternSync() {
  const { designManager } = useMainContext();
  const selectedPatternId = designManager.productManager.textureManager.selectedPatternId;
  const { patternID, productSlug } = useParams<{
    patternID?: string;
    productSlug: string;
  }>();
  const selectedPatternIdFromUrl = parsePatternIdParam(patternID);
  const location = useLocation();
  const navigate = useNavigate();
  const isBulkMode = /\/bulk(\/|$)/.test(location.pathname);

  useEffect(() => {
    if (!productSlug) return;

    const effectivePatternId = selectedPatternId ?? selectedPatternIdFromUrl;
    if (effectivePatternId === null) return;

    const targetPath = buildPatternPath(productSlug, effectivePatternId, isBulkMode);
    if (location.pathname === targetPath) return;

    navigate(targetPath, { replace: true });
  }, [isBulkMode, location.pathname, navigate, productSlug, selectedPatternId, selectedPatternIdFromUrl]);
}
