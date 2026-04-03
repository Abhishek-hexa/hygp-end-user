import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useInitializeProductApis } from '../../api/useInitializeProductApis';
import {
  defaultProductSlug,
  parsePatternIdParam,
  productSlugToType,
} from '../../state/product/productRouting';
import { ProductType } from '../../state/product/types';
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
  const selectedProductType = productSlugToType(productSlug);

  useEffect(() => {
    if (!selectedProductType) {
      navigate(`/${defaultProductSlug}`, { replace: true });
    }
  }, [navigate, selectedProductType]);

  // Hook natively handles tracking dependencies and API orchestration
  useInitializeProductApis(
    productManager,
    uiManager,
    selectedProductType || ProductType.DOG_COLLAR, // Use default if slug is invalid while redirect happens
    selectedPatternIdFromUrl,
  );
}
