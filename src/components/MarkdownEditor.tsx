import React, { useCallback, useEffect } from 'react'
import { Box, IconButton, Paper } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import { NoteTitle } from './NoteTitle'
import { TagManager } from './TagManager'
import { TaskManager } from './TaskManager'
import { PictureAsPdf as PdfIcon } from '@mui/icons-material'
import { useProject } from '../contexts/ProjectContext'

export const MarkdownEditor: React.FC = () => {
  const { currentNote, updateNote, exportNoteToPDF } = useProject()

  const handleEditorChange = useCallback((value?: string) => {
    if (currentNote && typeof value === 'string') {
      updateNote(currentNote.id, value)
    }
  }, [currentNote, updateNote])

  // Force focus on editor when note changes
  useEffect(() => {
    if (currentNote) {
      const editor = document.querySelector('.w-md-editor-text-input') as HTMLTextAreaElement
      if (editor) {
        editor.focus()
      }
    }
  }, [currentNote])

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
      
      <div data-color-mode="dark" style={{ flex: 1, height: '100%' }}>
        <MDEditor
          value={currentNote.content}
          onChange={handleEditorChange}
          height="100%"
          preview="edit"
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]],
          }}
          textareaProps={{
            placeholder: 'Commencez à écrire...',
            autoFocus: true,
            style: {
              fontSize: '16px',
              lineHeight: '1.6',
              height: '100%',
            }
          }}
          style={{
            height: '100%',
            maxHeight: '100%',
          }}
        />
      </div>

      <Paper sx={{ p: 2, mt: 2 }}>
        <TaskManager noteId={currentNote.id} />
      </Paper>
    </Box>
  )
}
