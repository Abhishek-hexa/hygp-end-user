import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { initializeProductApis } from '../../api/initializeProductApis';
import {
  defaultProductSlug,
  parsePatternIdParam,
  productSlugToType,
} from '../../state/product/productRouting';
import { useMainContext } from '../useMainContext';

export function useProductInit() {
  const { designManager, uiManager } = useMainContext();
  const productManager = designManager.productManager;
  const { patternID, productSlug } = useParams<{
    patternID?: string;
    productSlug: string;
  }>();
  const selectedPatternIdFromUrl = parsePatternIdParam(patternID);
  const navigate = useNavigate();
  const lastInitializedProductSlugRef = useRef<string | null>(null);
  const selectedProductType = productSlugToType(productSlug);

  useEffect(() => {
    if (!selectedProductType) {
      navigate(`/${defaultProductSlug}`, { replace: true });
      return;
    }
    if (lastInitializedProductSlugRef.current === productSlug) return;

    lastInitializedProductSlugRef.current = productSlug ?? null;
    void initializeProductApis(
      productManager,
      uiManager,
      selectedProductType,
      selectedPatternIdFromUrl,
    );
  }, [navigate, productManager, productSlug, selectedPatternIdFromUrl, selectedProductType, uiManager]);
}
