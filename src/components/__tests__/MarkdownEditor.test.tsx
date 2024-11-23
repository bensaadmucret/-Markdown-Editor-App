import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MarkdownEditor } from '../MarkdownEditor'
import { ProjectProvider } from '../../contexts/ProjectContext'
import { ThemeProvider } from '@mui/material'
import { gruvboxTheme } from '../../theme/gruvbox'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Mock du contexte avec des données de test
const mockNote = {
  id: '1',
  title: 'Test Note',
  content: '# Hello World',
  projectId: '1',
  tags: [],
  tasks: [],
}

const mockContext = {
  currentNote: mockNote,
  updateNote: jest.fn(),
  exportNoteToPDF: jest.fn(),
}

// Mock du hook useProject
jest.mock('../../contexts/ProjectContext', () => ({
  ...jest.requireActual('../../contexts/ProjectContext'),
  useProject: () => mockContext,
}))

describe('🎨 MarkdownEditor Component', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={gruvboxTheme}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <ProjectProvider>
            {component}
          </ProjectProvider>
        </LocalizationProvider>
      </ThemeProvider>
    )
  }

  it('✨ renders the editor with initial content', () => {
    renderWithProviders(<MarkdownEditor />)
    
    // Vérifier que le titre de la note est affiché
    expect(screen.getByText('Test Note')).toBeInTheDocument()
    
    // Vérifier que le contenu initial est présent
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveValue('# Hello World')
  })

  it('🖋 updates note content when typing', () => {
    renderWithProviders(<MarkdownEditor />)
    
    const editor = screen.getByRole('textbox')
    fireEvent.change(editor, { target: { value: '# Updated Content' } })
    
    expect(mockContext.updateNote).toHaveBeenCalledWith(
      mockNote.id,
      '# Updated Content'
    )
  })

  it('📄 exports note to PDF when clicking export button', () => {
    renderWithProviders(<MarkdownEditor />)
    
    const exportButton = screen.getByRole('button', { name: /pdf/i })
    fireEvent.click(exportButton)
    
    expect(mockContext.exportNoteToPDF).toHaveBeenCalledWith(mockNote.id)
  })

  it('🎯 handles empty note content gracefully', () => {
    mockContext.currentNote = { ...mockNote, content: '' }
    renderWithProviders(<MarkdownEditor />)
    
    const editor = screen.getByRole('textbox')
    expect(editor).toHaveValue('')
    expect(editor).toHaveAttribute('placeholder', 'Commencez à écrire...')
  })
})
