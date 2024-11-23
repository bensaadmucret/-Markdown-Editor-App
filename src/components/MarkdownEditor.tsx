import React, { useCallback } from 'react'
import { Box, Paper } from '@mui/material'
import { NoteTitle } from './NoteTitle'
import { TagManager } from './TagManager'
import { TaskManager } from './TaskManager'
import { useProject } from '../contexts/ProjectContext'
import { MarkdownWorkspace } from './MarkdownWorkspace'

export const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote } = useProject()
  console.log('MarkdownEditor currentNote:', currentNote); // Debug log

  const handleEditorChange = useCallback((value: string) => {
    if (currentNote) {
      updateNote(currentNote.id, value)
    }
  }, [currentNote, updateNote])

  if (!currentNote) {
    console.log('MarkdownEditor: currentNote is null'); // Debug log
    return null
  }

  console.log('MarkdownEditor rendering with noteId:', currentNote.id); // Debug log

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <NoteTitle noteId={currentNote.id} />
      </Box>

      <TagManager noteId={currentNote.id} />
      
      <Box sx={{ flex: 1, height: '100%', position: 'relative' }}>
        <MarkdownWorkspace
          initialValue={currentNote.content}
          onChange={handleEditorChange}
          noteId={currentNote.id}
        />
      </Box>

      <Paper sx={{ p: 2, mt: 2 }}>
        <TaskManager noteId={currentNote.id} />
      </Paper>
    </Box>
  )
}
