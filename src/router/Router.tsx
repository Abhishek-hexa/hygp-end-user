import { observer } from 'mobx-react-lite';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Viewer } from '../components/Viewer/Viewer';
import { NavigationRoutes } from '../constant';

export const Router = observer(() => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={NavigationRoutes.Default} element={<Viewer />} />
      </Routes>
    </BrowserRouter>
  );
});
