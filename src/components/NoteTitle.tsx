import React, { useState } from 'react'
import { TextField, Box } from '@mui/material'
import { useProject } from '../contexts/ProjectContext'

interface NoteTitleProps {
  noteId: string
}

export const NoteTitle: React.FC<NoteTitleProps> = ({ noteId }) => {
  const { notes, updateNoteTitle } = useProject()
  const note = notes.find(n => n.id === noteId)
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(note?.title || '')

  const handleBlur = () => {
    if (note && title.trim() !== note.title) {
      updateNoteTitle(noteId, title.trim() || 'Sans titre')
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur()
    }
  }

  if (!note) return null

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isEditing ? (
        <TextField
          fullWidth
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          variant="standard"
          sx={{ fontSize: '1.5rem' }}
        />
      ) : (
        <Box
          onClick={() => setIsEditing(true)}
          sx={{
            fontSize: '1.5rem',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            p: 1,
            borderRadius: 1,
          }}
        >
          {note.title || 'Sans titre'}
        </Box>
      )}
    </Box>
  )
}
