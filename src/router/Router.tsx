import { observer } from 'mobx-react-lite';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Viewer } from '../components/Viewer/Viewer';
import { NavigationRoutes } from '../constant';
import { defaultProductSlug } from '../state/product/productRouting';

export const Router = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={NavigationRoutes.Default}
          element={<Navigate to={`/${defaultProductSlug}`} replace />}
        />
        <Route path={NavigationRoutes.ProductPattern} element={<Viewer />} />
        <Route path={NavigationRoutes.Product} element={<Viewer />} />
        <Route
          path={NavigationRoutes.NotFound}
          element={<Navigate to={`/${defaultProductSlug}`} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
});
