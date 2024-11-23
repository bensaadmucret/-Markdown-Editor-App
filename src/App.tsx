import React, { useState } from 'react'
import { Box, CssBaseline, ThemeProvider, createTheme, IconButton, Typography, Drawer } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { fr } from 'date-fns/locale'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { ProjectProvider, useProject } from './contexts/ProjectContext'
import { Sidebar } from './components/Sidebar'
import { MarkdownEditor } from './components/MarkdownEditor'
import { SearchBar } from './components/SearchBar'
import { gruvboxTheme } from './theme/gruvbox'
import { Add as AddIcon, Menu as MenuIcon } from '@mui/icons-material'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const theme = createTheme(gruvboxTheme)

const DRAWER_WIDTH = 240
const MINI_DRAWER_WIDTH = 68

const MainContent = () => {
  const { currentNote, createProject } = useProject()
  const [drawerOpen, setDrawerOpen] = useState(true)

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
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
        <IconButton
          onClick={() => createProject('Nouveau projet')}
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
          <AddIcon />
        </IconButton>
      </Box>

      {/* Zone de navigation des projets */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={drawerOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            border: 'none',
            borderRight: 1,
            borderColor: 'divider',
            ml: `${MINI_DRAWER_WIDTH}px`,
            bgcolor: 'background.paper',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <SearchBar />
        </Box>
        <Sidebar />
      </Drawer>

      {/* Zone principale */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: 'relative',
          width: '100%',
          marginLeft: drawerOpen ? `${DRAWER_WIDTH}px` : 0,
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflow: 'hidden',
        }}
      >
        {currentNote ? (
          <MarkdownEditor />
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography variant="h5" color="text.secondary">
              Sélectionnez une note pour commencer
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <CssBaseline />
        <ProjectProvider>
          <MainContent />
        </ProjectProvider>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
