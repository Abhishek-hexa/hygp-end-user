import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useRef } from 'react';

import { useMainContext } from '../../../hooks/useMainContext';
import { Logger } from '../../../utils/Logger';

export const NavBar = observer(() => {
  const { designManager } = useMainContext();
  const { viewManager } = designManager;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousBlobUrlRef = useRef<string | null>(null);

  const handleExportJson = () => {
    const meshInfoJson = viewManager.meshInfoJson;

    if (!meshInfoJson) {
      Logger.warn('No mesh info JSON to export');
      return;
    }

    try {
      const jsonString = JSON.stringify(meshInfoJson, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'mesh-info.json';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      Logger.error(`Error exporting JSON: ${error}`);
    }
  };

  const handleLoadGlb = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Revoke previous blob URL to prevent memory leak
      if (previousBlobUrlRef.current) {
        URL.revokeObjectURL(previousBlobUrlRef.current);
      }

      const blobUrl = URL.createObjectURL(file);
      previousBlobUrlRef.current = blobUrl;
      viewManager.setGlbUrl(blobUrl);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".glb"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <AppBar position="fixed" sx={{ bgcolor: '#1976d2', zIndex: 1300 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            3D Viewer
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleExportJson}
              sx={{ '&:hover': { bgcolor: '#1976d2' }, bgcolor: '#2196f3' }}>
              Export JSON
            </Button>
            <Button
              variant="contained"
              onClick={handleLoadGlb}
              sx={{ '&:hover': { bgcolor: '#388e3c' }, bgcolor: '#4caf50' }}>
              Load GLB
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </>
  );
});
