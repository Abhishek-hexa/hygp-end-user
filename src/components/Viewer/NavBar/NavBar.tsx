import { AppBar, Toolbar, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';

export const NavBar = observer(() => {
  return (
    <AppBar position="fixed" sx={{ bgcolor: '#1976d2', zIndex: 1300 }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Product Viewer
        </Typography>
      </Toolbar>
    </AppBar>
  );
});
