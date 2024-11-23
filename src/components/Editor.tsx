import React from 'react'
import { Box, IconButton, Paper, Divider } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import { useProject } from '../contexts/ProjectContext'
import { NoteTitle } from './NoteTitle'
import { TagManager } from './TagManager'
import { TaskManager } from './TaskManager'
import { PictureAsPdf as PdfIcon } from '@mui/icons-material'

export const Editor: React.FC = () => {
  const { currentNote, updateNote, exportNoteToPDF } = useProject()

  if (!currentNote) {
    return null
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NoteTitle noteId={currentNote.id} />
        <IconButton onClick={() => exportNoteToPDF(currentNote.id)}>
          <PdfIcon />
        </IconButton>
      </Box>

      <TagManager noteId={currentNote.id} />
      
      <Box sx={{ flexGrow: 1, my: 2 }}>
        <MDEditor
          value={currentNote.content}
          onChange={value => updateNote(currentNote.id, value || '')}
          preview="live"
          height="100%"
        />
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <TaskManager noteId={currentNote.id} />
      </Paper>
    </Box>
  )
}
