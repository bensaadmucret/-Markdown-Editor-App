import React from 'react';
import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  useTheme as useMuiTheme,
} from '@mui/material';
import { useTheme } from '../contexts/ThemeContext';
import { ColorPicker } from './ColorPicker';
import { ProfileManager } from './ProfileManager';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const Settings = () => {
  const [value, setValue] = React.useState(0);
  const {
    isDarkMode,
    backgroundColor,
    sidebarColor,
    buttonColor,
    setIsDarkMode,
    setBackgroundColor,
    setSidebarColor,
    setButtonColor,
  } = useTheme();

  const muiTheme = useMuiTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Paper 
        sx={{ 
          borderRadius: 0,
          height: '100%',
          bgcolor: 'background.paper',
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="settings tabs"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tab label="Appearance" />
          <Tab label="Profiles" />
        </Tabs>

        <TabPanel value={value} index={0}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Theme
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <ColorPicker
                  label="Background Color"
                  color={backgroundColor}
                  onChange={setBackgroundColor}
                />
                <ColorPicker
                  label="Sidebar Color"
                  color={sidebarColor}
                  onChange={setSidebarColor}
                />
                <ColorPicker
                  label="Button Color"
                  color={buttonColor}
                  onChange={setButtonColor}
                />
              </Box>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Mode
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: !isDarkMode ? muiTheme.palette.primary.main : 'background.paper',
                    color: !isDarkMode ? 'primary.contrastText' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: !isDarkMode 
                        ? muiTheme.palette.primary.dark 
                        : muiTheme.palette.action.hover,
                    },
                  }}
                  onClick={() => setIsDarkMode(false)}
                >
                  <Typography variant="subtitle1" align="center">
                    Light Mode
                  </Typography>
                </Paper>

                <Paper
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    bgcolor: isDarkMode ? muiTheme.palette.primary.main : 'background.paper',
                    color: isDarkMode ? 'primary.contrastText' : 'text.primary',
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: isDarkMode 
                        ? muiTheme.palette.primary.dark 
                        : muiTheme.palette.action.hover,
                    },
                  }}
                  onClick={() => setIsDarkMode(true)}
                >
                  <Typography variant="subtitle1" align="center">
                    Dark Mode
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Box>
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ProfileManager />
        </TabPanel>
      </Paper>
    </Box>
  );
};
