import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Typography,
  Tooltip,
  Divider,
  Switch,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  FileCopy as FileCopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useWorkspace, WorkspaceProfile } from '../contexts/WorkspaceContext';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileFormData {
  name: string;
  theme: WorkspaceProfile['theme'];
  settings: WorkspaceProfile['settings'];
}

const fontFamilies = [
  '"Roboto", "Helvetica", "Arial", sans-serif',
  'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
  '"SF Pro Text", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  'Georgia, "Times New Roman", Times, serif',
];

export const ProfileManager: React.FC = () => {
  const {
    currentWorkspace,
    currentProfile,
    addProfile,
    updateProfile,
    removeProfile,
    switchProfile,
    duplicateProfile,
  } = useWorkspace();

  const { isDarkMode } = useTheme();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<WorkspaceProfile | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '',
    theme: {},
    settings: {
      defaultView: 'single',
      splitOrientation: 'vertical',
      splitRatio: 0.5,
      showLineNumbers: true,
      autoSave: true,
      spellCheck: true,
      fontSize: 14,
      fontFamily: fontFamilies[0],
      tabSize: 2,
      useSoftTabs: true,
      lineHeight: 1.5,
      showInvisibles: false,
      wordWrap: true,
    },
  });

  const handleOpenDialog = (profile?: WorkspaceProfile) => {
    if (profile) {
      setEditingProfile(profile);
      setFormData({
        name: profile.name,
        theme: { ...profile.theme },
        settings: { ...profile.settings },
      });
    } else {
      setEditingProfile(null);
      setFormData({
        name: '',
        theme: {},
        settings: {
          defaultView: 'single',
          splitOrientation: 'vertical',
          splitRatio: 0.5,
          showLineNumbers: true,
          autoSave: true,
          spellCheck: true,
          fontSize: 14,
          fontFamily: fontFamilies[0],
          tabSize: 2,
          useSoftTabs: true,
          lineHeight: 1.5,
          showInvisibles: false,
          wordWrap: true,
        },
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProfile(null);
  };

  const handleSubmit = () => {
    if (!currentWorkspace) return;

    if (editingProfile) {
      updateProfile(currentWorkspace.id, editingProfile.id, formData);
    } else {
      addProfile(currentWorkspace.id, formData);
    }

    handleCloseDialog();
  };

  const handleDuplicate = (profile: WorkspaceProfile) => {
    if (!currentWorkspace) return;
    duplicateProfile(currentWorkspace.id, profile.id, `${profile.name} (Copy)`);
  };

  const handleDelete = (profileId: string) => {
    if (!currentWorkspace) return;
    removeProfile(currentWorkspace.id, profileId);
  };

  const handleSwitch = (profileId: string) => {
    if (!currentWorkspace) return;
    switchProfile(currentWorkspace.id, profileId);
  };

  if (!currentWorkspace) {
    return (
      <Box p={3}>
        <Typography variant="body1" color="text.secondary">
          Please select a workspace to manage profiles.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6">Profiles</Typography>
        <Button
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          variant="contained"
          size="small"
        >
          New Profile
        </Button>
      </Box>

      <List>
        {currentWorkspace.profiles.map((profile) => (
          <Paper
            key={profile.id}
            elevation={1}
            sx={{
              m: 1,
              bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
            }}
          >
            <ListItem>
              <ListItemText
                primary={profile.name}
                secondary={
                  <Typography variant="body2" color="text.secondary">
                    {profile.settings.defaultView === 'split' ? 'Split View' : 'Single View'} •{' '}
                    {profile.settings.fontSize}px • {profile.settings.autoSave ? 'Auto-save' : 'Manual save'}
                  </Typography>
                }
              />
              <ListItemSecondaryAction>
                <Tooltip title="Set as active">
                  <IconButton
                    edge="end"
                    onClick={() => handleSwitch(profile.id)}
                    color={currentWorkspace.currentProfileId === profile.id ? 'primary' : 'default'}
                  >
                    <CheckIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Duplicate">
                  <IconButton edge="end" onClick={() => handleDuplicate(profile)}>
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                  <IconButton edge="end" onClick={() => handleOpenDialog(profile)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                {currentWorkspace.profiles.length > 1 && (
                  <Tooltip title="Delete">
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(profile.id)}
                      disabled={currentWorkspace.profiles.length <= 1}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </ListItemSecondaryAction>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProfile ? 'Edit Profile' : 'New Profile'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <TextField
              label="Profile Name"
              fullWidth
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <Typography variant="h6" gutterBottom>
              Editor Settings
            </Typography>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <FormControl>
                <InputLabel>Default View</InputLabel>
                <Select
                  value={formData.settings.defaultView}
                  label="Default View"
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      defaultView: e.target.value as 'split' | 'single',
                    },
                  })}
                >
                  <MenuItem value="single">Single View</MenuItem>
                  <MenuItem value="split">Split View</MenuItem>
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Split Orientation</InputLabel>
                <Select
                  value={formData.settings.splitOrientation}
                  label="Split Orientation"
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      splitOrientation: e.target.value as 'horizontal' | 'vertical',
                    },
                  })}
                >
                  <MenuItem value="vertical">Vertical</MenuItem>
                  <MenuItem value="horizontal">Horizontal</MenuItem>
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Font Family</InputLabel>
                <Select
                  value={formData.settings.fontFamily}
                  label="Font Family"
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      fontFamily: e.target.value as string,
                    },
                  })}
                >
                  {fontFamilies.map((font) => (
                    <MenuItem key={font} value={font} sx={{ fontFamily: font }}>
                      {font.split(',')[0].replace(/["']/g, '')}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <InputLabel>Tab Size</InputLabel>
                <Select
                  value={formData.settings.tabSize}
                  label="Tab Size"
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      tabSize: e.target.value as number,
                    },
                  })}
                >
                  {[2, 4, 8].map((size) => (
                    <MenuItem key={size} value={size}>
                      {size} spaces
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box>
              <Typography gutterBottom>Font Size: {formData.settings.fontSize}px</Typography>
              <Slider
                value={formData.settings.fontSize}
                onChange={(_, value) => setFormData({
                  ...formData,
                  settings: {
                    ...formData.settings,
                    fontSize: value as number,
                  },
                })}
                min={12}
                max={24}
                step={1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography gutterBottom>Line Height: {formData.settings.lineHeight}</Typography>
              <Slider
                value={formData.settings.lineHeight}
                onChange={(_, value) => setFormData({
                  ...formData,
                  settings: {
                    ...formData.settings,
                    lineHeight: value as number,
                  },
                })}
                min={1}
                max={2}
                step={0.1}
                marks
                valueLabelDisplay="auto"
              />
            </Box>

            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Show Line Numbers</Typography>
                <Switch
                  checked={formData.settings.showLineNumbers}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      showLineNumbers: e.target.checked,
                    },
                  })}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Auto Save</Typography>
                <Switch
                  checked={formData.settings.autoSave}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      autoSave: e.target.checked,
                    },
                  })}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Spell Check</Typography>
                <Switch
                  checked={formData.settings.spellCheck}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      spellCheck: e.target.checked,
                    },
                  })}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Word Wrap</Typography>
                <Switch
                  checked={formData.settings.wordWrap}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      wordWrap: e.target.checked,
                    },
                  })}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Show Invisibles</Typography>
                <Switch
                  checked={formData.settings.showInvisibles}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      showInvisibles: e.target.checked,
                    },
                  })}
                />
              </Box>

              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Typography>Use Soft Tabs</Typography>
                <Switch
                  checked={formData.settings.useSoftTabs}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: {
                      ...formData.settings,
                      useSoftTabs: e.target.checked,
                    },
                  })}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.name.trim()}
          >
            {editingProfile ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
