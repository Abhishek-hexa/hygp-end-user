import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';

import { NavBar } from './NavBar/NavBar';

export const Viewer = observer(() => {
  return (
    <Box sx={{ bgcolor: 'white', height: '100vh', width: '100%' }}>
      <NavBar />
      <Box
        sx={{
          alignItems: 'center',
          color: '#444',
          display: 'flex',
          height: 'calc(100vh - 64px)',
          justifyContent: 'center',
          marginTop: '64px',
          width: '100%',
        }}>
        3D rendering is temporarily disabled.
      </Box>
    </Box>
  );
});
