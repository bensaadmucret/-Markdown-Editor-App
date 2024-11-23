import React, { createContext, useContext, useState, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  sidebarColor: string;
  backgroundColor: string;
  fontSize: number;
  setFontSize: (size: number) => void;
  showInvisibles: boolean;
  toggleInvisibles: () => void;
  showLineNumbers: boolean;
  toggleLineNumbers: () => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleDarkMode: () => {},
  sidebarColor: '',
  backgroundColor: '',
  fontSize: 14,
  setFontSize: () => {},
  showInvisibles: false,
  toggleInvisibles: () => {},
  showLineNumbers: true,
  toggleLineNumbers: () => {},
  currentTheme: 'stone',
  setCurrentTheme: () => {},
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

const themes = {
  stone: {
    light: {
      primary: '#78716c',
      background: '#d6d3d1',
      surface: '#e7e5e4',
      text: '#1c1917',
      sidebar: '#f5f5f4',
    },
    dark: {
      primary: '#78716c',
      background: '#1c1917',
      surface: '#292524',
      text: '#d6d3d1',
      sidebar: '#0c0a09',
    },
  },
  ocean: {
    light: {
      primary: '#0ea5e9',
      background: '#e0f2fe',
      surface: '#f0f9ff',
      text: '#0c4a6e',
      sidebar: '#f0f9ff',
    },
    dark: {
      primary: '#0ea5e9',
      background: '#0c4a6e',
      surface: '#075985',
      text: '#e0f2fe',
      sidebar: '#082f49',
    },
  },
  forest: {
    light: {
      primary: '#22c55e',
      background: '#dcfce7',
      surface: '#f0fdf4',
      text: '#14532d',
      sidebar: '#f0fdf4',
    },
    dark: {
      primary: '#22c55e',
      background: '#14532d',
      surface: '#166534',
      text: '#dcfce7',
      sidebar: '#052e16',
    },
  },
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('fontSize');
    return saved ? JSON.parse(saved) : 14;
  });
  const [showInvisibles, setShowInvisibles] = useState(() => {
    const saved = localStorage.getItem('showInvisibles');
    return saved ? JSON.parse(saved) : false;
  });
  const [showLineNumbers, setShowLineNumbers] = useState(() => {
    const saved = localStorage.getItem('showLineNumbers');
    return saved ? JSON.parse(saved) : true;
  });
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('currentTheme');
    return saved && themes[saved as keyof typeof themes] ? saved : 'stone';
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      localStorage.setItem('isDarkMode', JSON.stringify(newValue));
      return newValue;
    });
  };

  const toggleInvisibles = () => {
    setShowInvisibles(prev => {
      const newValue = !prev;
      localStorage.setItem('showInvisibles', JSON.stringify(newValue));
      return newValue;
    });
  };

  const toggleLineNumbers = () => {
    setShowLineNumbers(prev => {
      const newValue = !prev;
      localStorage.setItem('showLineNumbers', JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleSetFontSize = (size: number) => {
    if (size >= 8 && size <= 32) {
      setFontSize(size);
      localStorage.setItem('fontSize', JSON.stringify(size));
    }
  };

  const handleSetCurrentTheme = (theme: string) => {
    if (themes[theme as keyof typeof themes]) {
      setCurrentTheme(theme);
      localStorage.setItem('currentTheme', theme);
    }
  };

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].primary,
      },
      background: {
        default: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].background,
        paper: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].surface,
      },
      text: {
        primary: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].text,
      },
    },
    typography: {
      fontSize,
    },
  });

  const value = {
    isDarkMode,
    toggleDarkMode,
    sidebarColor: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].sidebar,
    backgroundColor: themes[currentTheme as keyof typeof themes][isDarkMode ? 'dark' : 'light'].background,
    fontSize,
    setFontSize: handleSetFontSize,
    showInvisibles,
    toggleInvisibles,
    showLineNumbers,
    toggleLineNumbers,
    currentTheme,
    setCurrentTheme: handleSetCurrentTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
