import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { initializeProductApis } from '../../api/initializeProductApis';
import { useMainContext } from '../../hooks/useMainContext';
import {
  defaultProductSlug,
  productSlugToType,
} from '../../state/product/productRouting';
import { CanvasPanel } from './CanvasPanel';
import { ConfigurationPanel } from './ConfigurationPanel';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  const mainContext = useMainContext();
  const productManager = mainContext.designManager.productManager;
  const navigate = useNavigate();
  const { productSlug } = useParams<{ productSlug: string }>();
  const selectedProductType = productSlugToType(productSlug);

  useEffect(() => {
    if (!selectedProductType) {
      navigate(`/${defaultProductSlug}`, { replace: true });
      return;
    }

    void initializeProductApis(productManager, selectedProductType);
  }, [navigate, productManager, selectedProductType]);

  return (
    <div className="h-dvh w-full bg-white pt-16 lg:pt-20">
      <NavBar />
      <div className="grid h-full w-full grid-cols-10 max-lg:grid-cols-1 max-lg:grid-rows-[minmax(0,1.18fr)_minmax(0,1fr)]">
        <div className="col-span-7 min-h-0 max-lg:col-span-1">
          <CanvasPanel />
        </div>
        <div className="col-span-3 min-h-0 max-lg:col-span-1">
          <ConfigurationPanel />
        </div>
      </div>
    </div>
  );
});
