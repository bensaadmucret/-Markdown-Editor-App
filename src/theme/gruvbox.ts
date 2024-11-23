import { ThemeOptions } from '@mui/material'

const gruvboxTheme: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#282828',
          color: '#ebdbb2',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#3c3836',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: '#504945',
            '&:hover': {
              backgroundColor: '#665c54',
            },
          },
          '&:hover': {
            backgroundColor: '#504945',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: '#a89984',
          minWidth: 40,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#504945',
        },
      },
    },
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#458588',
      light: '#83a598',
      dark: '#076678',
      contrastText: '#fbf1c7',
    },
    secondary: {
      main: '#b16286',
      light: '#d3869b',
      dark: '#8f3f71',
      contrastText: '#fbf1c7',
    },
    background: {
      default: '#282828',
      paper: '#3c3836',
    },
    error: {
      main: '#cc241d',
      light: '#fb4934',
      dark: '#9d0006',
      contrastText: '#fbf1c7',
    },
    warning: {
      main: '#d79921',
      light: '#fabd2f',
      dark: '#b57614',
      contrastText: '#fbf1c7',
    },
    info: {
      main: '#458588',
      light: '#83a598',
      dark: '#076678',
      contrastText: '#fbf1c7',
    },
    success: {
      main: '#98971a',
      light: '#b8bb26',
      dark: '#79740e',
      contrastText: '#fbf1c7',
    },
    text: {
      primary: '#ebdbb2',
      secondary: '#a89984',
      disabled: '#7c6f64',
    },
    divider: '#504945',
    action: {
      active: '#ebdbb2',
      hover: '#504945',
      selected: '#665c54',
      disabled: '#7c6f64',
      disabledBackground: '#3c3836',
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      color: '#ebdbb2',
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#a89984',
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#a89984',
    },
    body1: {
      fontSize: '1rem',
      color: '#ebdbb2',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#d5c4a1',
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
}

export { gruvboxTheme }
