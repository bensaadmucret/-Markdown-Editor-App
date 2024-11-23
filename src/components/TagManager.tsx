import React, { useState } from 'react'
import {
  Chip,
  IconButton,
  TextField,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import { useProject } from '../contexts/ProjectContext'

interface TagManagerProps {
  noteId: string
}

export const TagManager: React.FC<TagManagerProps> = ({ noteId }) => {
  const { tags, createTag, addTagToNote, removeTagFromNote, notes } = useProject()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTagName, setNewTagName] = useState('')
  const [newTagColor, setNewTagColor] = useState('#1976d2')

  const currentNote = notes.find(note => note.id === noteId)
  const noteTags = currentNote?.tags || []

  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const tag = createTag(newTagName.trim(), newTagColor)
      addTagToNote(noteId, tag.id)
      setNewTagName('')
      setNewTagColor('#1976d2')
      setIsDialogOpen(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
      {noteTags.map(tagId => {
        const tag = tags.find(t => t.id === tagId)
        if (!tag) return null
        return (
          <Chip
            key={tag.id}
            label={tag.name}
            sx={{ backgroundColor: tag.color, color: 'white' }}
            onDelete={() => removeTagFromNote(noteId, tag.id)}
          />
        )
      })}
      <IconButton size="small" onClick={() => setIsDialogOpen(true)}>
        <AddIcon />
      </IconButton>

      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Ajouter un tag</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Nom du tag"
              value={newTagName}
              onChange={e => setNewTagName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Couleur"
              type="color"
              value={newTagColor}
              onChange={e => setNewTagColor(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateTag} variant="contained">
            Ajouter
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
