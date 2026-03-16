import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useMainContext } from '../../hooks/useMainContext';
import CustomLoader from '../shared/CustomLoader';
import { CanvasPanel } from './CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';
import { initializeProductApis } from '../../api/initializeProductApis';
import {
  defaultProductSlug,
  productSlugToType,
} from '../../state/product/productRouting';

export const Viewer = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const uiManager = mainContext.uiManager;
  const navigate = useNavigate();
  const { productSlug } = useParams<{ productSlug: string }>();
  const selectedProductType = productSlugToType(productSlug);

  useEffect(() => {
    if (!selectedProductType) {
      navigate(`/${defaultProductSlug}`, { replace: true });
      return;
    }

    void initializeProductApis(productManager, uiManager, selectedProductType);
  }, [navigate, productManager, selectedProductType, uiManager]);

  return (
    <div className="relative h-dvh w-full bg-white pt-16 lg:pt-20">
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
