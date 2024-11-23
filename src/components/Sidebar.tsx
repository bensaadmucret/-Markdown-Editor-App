import React, { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Collapse,
  Typography,
  Button,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  ChevronRight as ChevronRightIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Folder as FolderIcon,
  Description as NoteIcon,
  LocalOffer as TagIcon,
  PushPin as PinIcon,
  MoreVert as MoreVertIcon,
  WorkspacesOutlined as WorkspaceIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useProject } from '../contexts/ProjectContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWorkspace } from '../contexts/WorkspaceContext';

interface SidebarProps {
  onWorkspaceChange?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onWorkspaceChange }) => {
  const { 
    projects, 
    currentProject, 
    notes, 
    switchProject, 
    switchNote, 
    createProject, 
    createNote, 
    togglePinNote, 
    updateProject, 
    updateNoteTitle,
    deleteProject,
    deleteNote 
  } = useProject();
  const { workspaces, currentWorkspace } = useWorkspace();
  const { sidebarColor, fontSize } = useTheme();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'folders' | 'tags' | 'workspaces'>('folders');
  const [noteMenuAnchorEl, setNoteMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [projectMenuAnchorEl, setProjectMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const toggleProject = (projectId: string) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const toggleWorkspace = (workspaceId: string) => {
    setExpandedWorkspaces(prev =>
      prev.includes(workspaceId)
        ? prev.filter(id => id !== workspaceId)
        : [...prev, workspaceId]
    );
  };

  const handleNoteMenuOpen = (event: React.MouseEvent<HTMLElement>, noteId: string) => {
    event.stopPropagation();
    setNoteMenuAnchorEl(event.currentTarget);
    setSelectedNoteId(noteId);
  };

  const handleNoteMenuClose = () => {
    setNoteMenuAnchorEl(null);
    setSelectedNoteId(null);
  };

  const handleProjectMenuOpen = (event: React.MouseEvent<HTMLElement>, projectId: string) => {
    event.stopPropagation();
    setProjectMenuAnchorEl(event.currentTarget);
    setSelectedProjectId(projectId);
  };

  const handleProjectMenuClose = () => {
    setProjectMenuAnchorEl(null);
    setSelectedProjectId(null);
  };

  const handlePinNote = () => {
    if (selectedNoteId) {
      togglePinNote(selectedNoteId);
      handleNoteMenuClose();
    }
  };

  const handleRenameNote = () => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note) {
        const newTitle = prompt('Nouveau nom de la note :', note.title);
        if (newTitle && newTitle !== note.title) {
          updateNoteTitle(selectedNoteId, newTitle);
        }
      }
      handleNoteMenuClose();
    }
  };

  const handleRenameProject = () => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const newName = prompt('Nouveau nom du projet :', project.name);
        if (newName && newName !== project.name) {
          updateProject(selectedProjectId, { name: newName });
        }
      }
      handleProjectMenuClose();
    }
  };

  const handleDeleteProject = () => {
    if (selectedProjectId) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const notesInProject = notes.filter(n => n.projectId === selectedProjectId);
        const confirmMessage = notesInProject.length > 0 
          ? `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" et ses ${notesInProject.length} note(s) ?`
          : `Êtes-vous sûr de vouloir supprimer le projet "${project.name}" ?`;
        
        if (window.confirm(confirmMessage)) {
          deleteProject(selectedProjectId);
        }
      }
      handleProjectMenuClose();
    }
  };

  const handleDeleteNote = () => {
    if (selectedNoteId) {
      const note = notes.find(n => n.id === selectedNoteId);
      if (note && window.confirm(`Êtes-vous sûr de vouloir supprimer la note "${note.title}" ?`)) {
        deleteNote(selectedNoteId);
      }
      handleNoteMenuClose();
    }
  };

  const renderFolderView = () => (
    <List>
      {projects.map(project => (
        <React.Fragment key={project.id}>
          <ListItem
            button
            onClick={() => toggleProject(project.id)}
            sx={{
              backgroundColor: currentProject?.id === project.id
                ? 'rgba(0, 0, 0, 0.08)'
                : 'transparent',
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleProject(project.id);
              }}
            >
              {expandedProjects.includes(project.id)
                ? <ExpandMoreIcon />
                : <ChevronRightIcon />}
            </IconButton>
            <FolderIcon sx={{ mr: 1, color: project.color }} />
            <ListItemText
              primary={project.name}
              sx={{ '& .MuiTypography-root': { fontSize } }}
            />
            <Tooltip title="Nouvelle note">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  const title = prompt('Nom de la note :');
                  if (title) {
                    createNote(project.id, title);
                  }
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <IconButton
              size="small"
              onClick={(e) => handleProjectMenuOpen(e, project.id)}
            >
              <MoreVertIcon />
            </IconButton>
          </ListItem>

          <Collapse in={expandedProjects.includes(project.id)}>
            <List component="div" disablePadding>
              {notes
                .filter(note => note.projectId === project.id)
                .sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
                .map(note => (
                  <ListItem
                    key={note.id}
                    button
                    onClick={() => switchNote(note.id)}
                    sx={{
                      pl: 4,
                      backgroundColor: currentProject?.currentNote?.id === note.id
                        ? 'rgba(0, 0, 0, 0.08)'
                        : 'transparent',
                    }}
                  >
                    <NoteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {note.title}
                          {note.pinned && (
                            <PinIcon sx={{ ml: 1, fontSize: '1rem', color: 'primary.main' }} />
                          )}
                        </Box>
                      }
                      secondary={note.tags.map(tag => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mt: 0.5 }}
                        />
                      ))}
                      sx={{ '& .MuiTypography-root': { fontSize } }}
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleNoteMenuOpen(e, note.id)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItem>
                ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );

  const renderTagView = () => {
    const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));
    return (
      <List>
        {allTags.map(tag => (
          <React.Fragment key={tag}>
            <ListItem button onClick={() => toggleProject(tag)}>
              <TagIcon sx={{ mr: 1 }} />
              <ListItemText primary={tag} />
            </ListItem>
            <Collapse in={expandedProjects.includes(tag)}>
              <List component="div" disablePadding>
                {notes
                  .filter(note => note.tags.includes(tag))
                  .map(note => (
                    <ListItem
                      key={note.id}
                      button
                      onClick={() => switchNote(note.id)}
                      sx={{ pl: 4 }}
                    >
                      <NoteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                      <ListItemText
                        primary={note.title}
                        sx={{ '& .MuiTypography-root': { fontSize } }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Collapse>
          </React.Fragment>
        ))}
      </List>
    );
  };

  const renderWorkspaceView = () => (
    <List>
      {workspaces.map(workspace => (
        <React.Fragment key={workspace.id}>
          <ListItem button onClick={() => toggleWorkspace(workspace.id)}>
            <WorkspaceIcon sx={{ mr: 1 }} />
            <ListItemText primary={workspace.name} />
          </ListItem>
          <Collapse in={expandedWorkspaces.includes(workspace.id)}>
            <List component="div" disablePadding>
              {notes
                .filter(note => note.workspaceId === workspace.id)
                .map(note => (
                  <ListItem
                    key={note.id}
                    button
                    onClick={() => switchNote(note.id)}
                    sx={{ pl: 4 }}
                  >
                    <NoteIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    <ListItemText
                      primary={note.title}
                      sx={{ '& .MuiTypography-root': { fontSize } }}
                    />
                  </ListItem>
                ))}
            </List>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );

  return (
    <>
      <Box sx={{
        width: 250,
        backgroundColor: sidebarColor,
        borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        height: '100vh',
        overflow: 'auto'
      }}>
        <Box sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography variant="h6" sx={{ fontSize }}>
            {viewMode === 'folders' ? 'Projets' :
             viewMode === 'tags' ? 'Tags' : 'Espaces'}
          </Typography>
          <Box>
            <Tooltip title="Vue par dossiers">
              <IconButton
                size="small"
                onClick={() => setViewMode('folders')}
                color={viewMode === 'folders' ? 'primary' : 'default'}
              >
                <FolderIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vue par tags">
              <IconButton
                size="small"
                onClick={() => setViewMode('tags')}
                color={viewMode === 'tags' ? 'primary' : 'default'}
              >
                <TagIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Vue par espaces">
              <IconButton
                size="small"
                onClick={() => setViewMode('workspaces')}
                color={viewMode === 'workspaces' ? 'primary' : 'default'}
              >
                <WorkspaceIcon />
              </IconButton>
            </Tooltip>
            {viewMode === 'folders' && (
              <Tooltip title="Nouveau projet">
                <IconButton
                  size="small"
                  onClick={() => {
                    const name = prompt('Nom du projet :');
                    if (name) {
                      createProject(name);
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        {viewMode === 'folders' && renderFolderView()}
        {viewMode === 'tags' && renderTagView()}
        {viewMode === 'workspaces' && renderWorkspaceView()}
      </Box>

      <Menu
        anchorEl={noteMenuAnchorEl}
        open={Boolean(noteMenuAnchorEl)}
        onClose={handleNoteMenuClose}
      >
        <MenuItem onClick={handleRenameNote}>
          <EditIcon sx={{ mr: 1 }} />
          Renommer
        </MenuItem>
        <MenuItem onClick={handlePinNote}>
          <PinIcon sx={{ mr: 1 }} />
          {notes.find(n => n.id === selectedNoteId)?.pinned ? 'Désépingler' : 'Épingler'}
        </MenuItem>
        <MenuItem onClick={handleDeleteNote} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={projectMenuAnchorEl}
        open={Boolean(projectMenuAnchorEl)}
        onClose={handleProjectMenuClose}
      >
        <MenuItem onClick={handleRenameProject}>
          <EditIcon sx={{ mr: 1 }} />
          Renommer
        </MenuItem>
        <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>
    </>
  );
};
