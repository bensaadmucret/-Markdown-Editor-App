import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import App from './App'
import theme from './theme'
import './index.css'

declare global {
  interface Window {
    __TAURI__?: boolean;
  }
}

// Ensure Tauri is available before initializing
async function initApp() {
  if (window.__TAURI__) {
    // Only initialize Tauri-specific features if running in Tauri
    const { appWindow } = await import('@tauri-apps/api/window')
    await appWindow.listen('tauri://update-status', function () {})
  }

  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  )
}

initApp()
