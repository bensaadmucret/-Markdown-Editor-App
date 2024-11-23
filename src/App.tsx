import React from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, IconButton } from '@mui/material';
import { ProjectProvider } from './contexts/ProjectContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/Sidebar';
import { MarkdownWorkspace } from './components/MarkdownWorkspace';
import { SearchBar } from './components/SearchBar';
import { createAppTheme } from './theme/theme';
import { useTheme } from './contexts/ThemeContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import WorkspaceManager from './components/WorkspaceManager';
import MenuIcon from '@mui/icons-material/Menu';

const ThemedApp = () => {
  const { 
    isDarkMode, 
    backgroundColor, 
    sidebarColor, 
    buttonColor, 
    fontSize 
  } = useTheme();

  const theme = createAppTheme({
    mode: isDarkMode ? 'dark' : 'light',
    backgroundColor,
    sidebarColor,
    buttonColor,
    fontSize,
  });

  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const DRAWER_WIDTH = 240;
  const MINI_DRAWER_WIDTH = 68;

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        height: '100vh',
        bgcolor: 'background.default'
      }}>
        {/* Barre d'action style Arc */}
        <Box
          component="nav"
          sx={{
            width: MINI_DRAWER_WIDTH,
            flexShrink: 0,
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2,
            pb: 2,
            zIndex: 1201,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ mb: 2 }}>
              <IconButton
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  mb: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Zone de navigation des projets */}
        <Box
          sx={{
            width: drawerOpen ? DRAWER_WIDTH : 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            bgcolor: 'background.paper',
            borderRight: 1,
            borderColor: 'divider',
            ml: `${MINI_DRAWER_WIDTH}px`,
            height: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            zIndex: 1200,
          }}
        >
          <Box sx={{ p: 2 }}>
            <SearchBar />
          </Box>
          <Sidebar />
        </Box>

        {/* Zone principale */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            position: 'relative',
            width: `calc(100% - ${MINI_DRAWER_WIDTH}px${drawerOpen ? ` - ${DRAWER_WIDTH}px` : ''})`,
            marginLeft: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflow: 'hidden',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ position: 'relative', flex: 1, height: '100%' }}>
            <MarkdownWorkspace />
          </Box>
        </Box>
      </Box>
    </MuiThemeProvider>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <WorkspaceProvider>
        <ProjectProvider>
          <ThemedApp />
        </ProjectProvider>
      </WorkspaceProvider>
    </ThemeProvider>
  );
};

export default App;
