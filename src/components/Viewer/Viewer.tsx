import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

import { useJsonParser } from '../../hooks/useJsonParser';
import { useMainContext } from '../../hooks/useMainContext';
import { Viewer3D } from '../Viewer3D/Viewer3D';
import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  const { designManager } = useMainContext();
  const { productManager } = designManager;

  const { data: meshInfoJson, loading } = useJsonParser(productManager.jsonUrl);
  useEffect(() => {
    if (meshInfoJson && !loading) {
      productManager.setMeshInfoJson(meshInfoJson);
    }
  }, [meshInfoJson, productManager, loading]);

  return (
    <Box sx={{ bgcolor: 'white', height: '100vh', width: '100%' }}>
      <NavBar />
      <Box
        sx={{ height: 'calc(100vh - 64px)', marginTop: '64px', width: '100%' }}>
        <Viewer3D />
      </Box>
    </Box>
  );
});
