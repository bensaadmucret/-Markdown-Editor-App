import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MarkdownEditor } from '../MarkdownEditor'
import { ProjectProvider } from '../../contexts/ProjectContext'
import { ThemeProvider } from '@mui/material'
import { gruvboxTheme } from '../../theme/gruvbox'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Mock des tags
const mockTags = [
  { id: 'tag1', name: 'test', color: '#ff0000' },
]

// Mock du contexte avec des données de test complètes
const mockNote = {
  id: '1',
  title: 'Test Note',
  content: '# Hello World',
  projectId: '1',
  tags: ['tag1'],
  tasks: [
    {
      id: '1',
      title: 'Test Task',
      completed: false,
      dueDate: new Date(),
    },
  ],
}

const mockProject = {
  id: '1',
  name: 'Test Project',
  notes: [mockNote],
}

const mockContext = {
  currentNote: mockNote,
  notes: [mockNote],
  projects: [mockProject],
  currentProject: mockProject,
  tags: mockTags,
  updateNote: jest.fn(),
  updateNoteTitle: jest.fn(),
  exportNoteToPDF: jest.fn(),
  addTag: jest.fn(),
  removeTag: jest.fn(),
  addTask: jest.fn(),
  updateTask: jest.fn(),
  removeTask: jest.fn(),
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
    const editor = screen.getByTestId('md-editor')
    expect(editor).toHaveValue('# Hello World')
  })

  it('🖋 updates note content when typing', () => {
    renderWithProviders(<MarkdownEditor />)
    
    const editor = screen.getByTestId('md-editor')
    fireEvent.change(editor, { target: { value: '# Updated Content' } })
    
    expect(mockContext.updateNote).toHaveBeenCalledWith(
      mockNote.id,
      '# Updated Content'
    )
  })

  it('📄 exports note to PDF when clicking export button', () => {
    renderWithProviders(<MarkdownEditor />)
    
    const exportButton = screen.getByTestId('PictureAsPdfIcon')
    fireEvent.click(exportButton.parentElement)
    
    expect(mockContext.exportNoteToPDF).toHaveBeenCalledWith(mockNote.id)
  })

  it('🎯 handles empty note content gracefully', () => {
    const emptyNote = { ...mockNote, content: '' }
    mockContext.currentNote = emptyNote
    mockContext.notes = [emptyNote]
    
    renderWithProviders(<MarkdownEditor />)
    
    const editor = screen.getByTestId('md-editor')
    expect(editor).toHaveValue('')
    expect(editor).toHaveAttribute('placeholder', 'Commencez à écrire...')
  })
})
