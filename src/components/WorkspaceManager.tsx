import React, { useState } from 'react';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { Box, Button, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel, Switch, FormControlLabel } from '@mui/material';

const WorkspaceManager: React.FC = () => {
  const { workspaces, addWorkspace, currentWorkspace, switchWorkspace } = useWorkspace();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    type: 'work' as const,
    theme: 'light',
    settings: {
      darkMode: false,
      splitView: false,
      privacyLevel: 'high' as const,
    },
  });

  const validateForm = () => {
    const errors: { name?: string } = {};
    if (!newWorkspace.name.trim()) {
      errors.name = 'Le nom est requis';
    } else if (workspaces.some(w => w.name.toLowerCase() === newWorkspace.name.toLowerCase())) {
      errors.name = 'Ce nom est déjà utilisé';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateWorkspace = () => {
    if (validateForm()) {
      addWorkspace(newWorkspace);
      setIsDialogOpen(false);
      setNewWorkspace({
        name: '',
        type: 'work',
        theme: 'light',
        settings: {
          darkMode: false,
          splitView: false,
          privacyLevel: 'high',
        },
      });
      setFormErrors({});
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <h2>Espaces de travail</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Nouvel espace
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        {workspaces.map((workspace) => (
          <Box
            key={workspace.id}
            sx={{
              p: 2,
              border: '1px solid',
              borderColor: currentWorkspace?.id === workspace.id ? 'primary.main' : 'grey.300',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                borderColor: 'primary.main',
              },
            }}
            onClick={() => switchWorkspace(workspace.id)}
          >
            <h3>{workspace.name}</h3>
            <p>Type: {workspace.type}</p>
            <Box sx={{ mt: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={workspace.settings.splitView}
                    disabled
                  />
                }
                label="Vue partagée"
              />
            </Box>
          </Box>
        ))}
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Créer un nouvel espace</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300, mt: 2 }}>
            <TextField
              label="Nom"
              value={newWorkspace.name}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
              error={!!formErrors.name}
              helperText={formErrors.name}
            />

            <FormControl>
              <InputLabel>Type</InputLabel>
              <Select
                value={newWorkspace.type}
                label="Type"
                data-testid="workspace-type-select"
                onChange={(e) => setNewWorkspace({ ...newWorkspace, type: e.target.value as any })}
              >
                <MenuItem value="work">Travail</MenuItem>
                <MenuItem value="studies">Études</MenuItem>
                <MenuItem value="leisure">Loisirs</MenuItem>
              </Select>
            </FormControl>

            <FormControlLabel
              control={
                <Switch
                  checked={newWorkspace.settings.splitView}
                  onChange={(e) => setNewWorkspace({
                    ...newWorkspace,
                    settings: { ...newWorkspace.settings, splitView: e.target.checked },
                  })}
                />
              }
              label="Vue partagée"
            />

            <FormControl>
              <InputLabel>Niveau de confidentialité</InputLabel>
              <Select
                value={newWorkspace.settings.privacyLevel}
                label="Niveau de confidentialité"
                data-testid="workspace-privacy-select"
                onChange={(e) => setNewWorkspace({
                  ...newWorkspace,
                  settings: { ...newWorkspace.settings, privacyLevel: e.target.value as any },
                })}
              >
                <MenuItem value="high">Élevé</MenuItem>
                <MenuItem value="medium">Moyen</MenuItem>
                <MenuItem value="low">Faible</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              onClick={handleCreateWorkspace}
              disabled={!newWorkspace.name || !!formErrors.name}
            >
              Créer
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default WorkspaceManager;
