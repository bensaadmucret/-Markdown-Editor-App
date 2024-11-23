import React, { useState } from 'react'
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  IconButton,
  Box,
  Typography,
  Menu,
  MenuItem,
} from '@mui/material'
import {
  MoreVert as MoreIcon,
  FolderOutlined as FolderIcon,
  NoteOutlined as NoteIcon,
  Add as AddIcon,
} from '@mui/icons-material'
import { useProject } from '../contexts/ProjectContext'

export const Sidebar: React.FC = () => {
  const {
    projects,
    notes,
    currentProject,
    currentNote,
    createProject,
    createNote,
    deleteProject,
    deleteNote,
    setCurrentProject,
    setCurrentNote,
  } = useProject()

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [itemType, setItemType] = useState<'project' | 'note' | null>(null)

  const handleMenuClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    id: string,
    type: 'project' | 'note'
  ) => {
    event.stopPropagation()
    setMenuAnchor(event.currentTarget)
    setSelectedItemId(id)
    setItemType(type)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
    setSelectedItemId(null)
    setItemType(null)
  }

  const handleDelete = () => {
    if (selectedItemId && itemType) {
      if (itemType === 'project') {
        deleteProject(selectedItemId)
      } else {
        deleteNote(selectedItemId)
      }
      handleMenuClose()
    }
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Projets */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List component="nav" sx={{ px: 1 }}>
          {/* En-tête des projets */}
          <ListItem
            sx={{
              mb: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              PROJETS
            </Typography>
            <IconButton
              size="small"
              onClick={() => createProject('Nouveau projet')}
              sx={{
                bgcolor: '#504945',
                borderRadius: 1,
                '&:hover': {
                  bgcolor: '#665d5d',
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </ListItem>

          {/* Liste des projets */}
          {projects.map((project) => (
            <React.Fragment key={project.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => handleMenuClick(e, project.id, 'project')}
                  >
                    <MoreIcon fontSize="small" />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={project.id === currentProject?.id}
                  onClick={() => setCurrentProject(project.id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <FolderIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={project.name}
                    primaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>

              {/* Notes du projet */}
              {project.id === currentProject?.id && (
                <List component="div" disablePadding sx={{ ml: 2 }}>
                  <ListItem
                    sx={{
                      mb: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      NOTES
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => createNote(project.id, 'Nouvelle note')}
                      sx={{
                        bgcolor: '#504945',
                        borderRadius: 1,
                        '&:hover': {
                          bgcolor: '#665d5d',
                        },
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </ListItem>

                  {notes
                    .filter((note) => note.projectId === project.id)
                    .map((note) => (
                      <ListItem
                        key={note.id}
                        disablePadding
                        secondaryAction={
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={(e) => handleMenuClick(e, note.id, 'note')}
                          >
                            <MoreIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemButton
                          selected={note.id === currentNote?.id}
                          onClick={() => setCurrentNote(note.id)}
                          sx={{
                            borderRadius: 1,
                            mb: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <NoteIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={note.title}
                            primaryTypographyProps={{
                              variant: 'body2',
                              noWrap: true,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                </List>
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>

      {/* Menu contextuel */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Supprimer
        </MenuItem>
      </Menu>
    </Box>
  )
}
