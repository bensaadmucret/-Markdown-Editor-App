import { createTheme, Theme } from '@mui/material/styles';

export interface CustomTheme {
  id: string;
  name: string;
  type: 'light' | 'dark';
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
}

export const defaultThemes: CustomTheme[] = [
  {
    id: 'light-default',
    name: 'Light Default',
    type: 'light',
    colors: {
      primary: '#1976d2',
      secondary: '#9c27b0',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      accent: '#ff4081',
    },
  },
  {
    id: 'dark-default',
    name: 'Dark Default',
    type: 'dark',
    colors: {
      primary: '#90caf9',
      secondary: '#ce93d8',
      background: '#121212',
      surface: '#1e1e1e',
      text: '#ffffff',
      accent: '#ff4081',
    },
  },
  {
    id: 'gruvbox-dark',
    name: 'Gruvbox Dark',
    type: 'dark',
    colors: {
      primary: '#ebdbb2',
      secondary: '#d79921',
      background: '#282828',
      surface: '#3c3836',
      text: '#ebdbb2',
      accent: '#d65d0e',
    },
  },
  {
    id: 'nord',
    name: 'Nord',
    type: 'dark',
    colors: {
      primary: '#88c0d0',
      secondary: '#81a1c1',
      background: '#2e3440',
      surface: '#3b4252',
      text: '#eceff4',
      accent: '#5e81ac',
    },
  },
];

export const createCustomTheme = (theme: CustomTheme): Theme => {
  return createTheme({
    palette: {
      mode: theme.type,
      primary: {
        main: theme.colors.primary,
      },
      secondary: {
        main: theme.colors.secondary,
      },
      background: {
        default: theme.colors.background,
        paper: theme.colors.surface,
      },
      text: {
        primary: theme.colors.text,
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
          },
        },
      },
    },
  });
};
