import { createTheme, ThemeOptions } from '@mui/material/styles';

interface CustomThemeOptions {
  mode: 'light' | 'dark';
  backgroundColor: string;
  sidebarColor: string;
  buttonColor: string;
  fontSize: number;
}

const colors = {
  stone: {
    900: '#1c1917',
    800: '#292524',
    600: '#44403c',
    500: '#78716c',
    200: '#d6d3d1',
  },
};

export const createAppTheme = ({
  mode = 'light',
  backgroundColor,
  sidebarColor,
  buttonColor,
  fontSize,
}: CustomThemeOptions) => {
  const baseTheme: ThemeOptions = {
    palette: {
      mode,
      primary: {
        main: colors.stone[600],
        light: colors.stone[500],
        dark: colors.stone[800],
        contrastText: colors.stone[200],
      },
      background: {
        default: mode === 'dark' ? colors.stone[900] : colors.stone[200],
        paper: mode === 'dark' ? colors.stone[800] : '#ffffff',
      },
      text: {
        primary: mode === 'dark' ? colors.stone[200] : colors.stone[900],
        secondary: mode === 'dark' ? colors.stone[500] : colors.stone[600],
      },
      divider: mode === 'dark' ? colors.stone[800] : colors.stone[200],
    },
    typography: {
      fontSize,
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      body1: {
        fontSize: '1rem',
        color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
      },
      body2: {
        fontSize: '0.875rem',
        color: mode === 'dark' ? colors.stone[500] : colors.stone[600],
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: backgroundColor,
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: mode === 'dark' ? colors.stone[900] : colors.stone[200],
            },
            '&::-webkit-scrollbar-thumb': {
              background: mode === 'dark' ? colors.stone[600] : colors.stone[500],
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: mode === 'dark' ? colors.stone[500] : colors.stone[600],
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: sidebarColor,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: sidebarColor,
            borderRight: `1px solid ${mode === 'dark' ? colors.stone[800] : colors.stone[200]}`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            backgroundColor: buttonColor,
            '&:hover': {
              backgroundColor: mode === 'dark' ? colors.stone[500] : colors.stone[600],
            },
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            color: mode === 'dark' ? colors.stone[200] : colors.stone[900],
            '&:hover': {
              backgroundColor: mode === 'dark' ? colors.stone[800] : colors.stone[200],
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: mode === 'dark' ? colors.stone[800] : colors.stone[200],
              '&:hover': {
                backgroundColor: mode === 'dark' ? colors.stone[800] : colors.stone[200],
              },
            },
          },
        },
      },
    },
  };

  return createTheme(baseTheme);
};
