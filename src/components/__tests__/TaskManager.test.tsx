import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskManager } from '../TaskManager'
import { ProjectProvider } from '../../contexts/ProjectContext'
import { ThemeProvider } from '@mui/material/styles'
import { gruvboxTheme } from '../../theme/gruvbox'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Mock des données de test
const mockNotes = [
  {
    id: 'note1',
    title: 'Test Note 1',
    content: 'Test content 1',
    tasks: [
      {
        id: '1',
        title: 'Test Task 1',
        completed: false,
        noteId: 'note1',
        dueDate: new Date('2024-11-23').toISOString(),
      },
      {
        id: '2',
        title: 'Test Task 2',
        completed: true,
        noteId: 'note1',
        dueDate: new Date('2024-11-23').toISOString(),
      },
    ],
  },
]

// Mock du contexte Project
const mockProjectContext = {
  notes: mockNotes,
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
  currentNote: mockNotes[0],
}

jest.mock('../../contexts/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="project-provider">{children}</div>
  ),
  useProject: () => mockProjectContext,
}))

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

describe('✅ TaskManager Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('🎯 renders task list correctly', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })

  it('✨ creates new task when submitting form', () => {
    renderWithProviders(<TaskManager noteId="note1" />)

    const input = screen.getByPlaceholderText('Nouvelle tâche')
    fireEvent.change(input, {
      target: { value: 'New Task' },
    })
    fireEvent.click(screen.getByTestId('add-task-button'))

    expect(mockProjectContext.createTask).toHaveBeenCalledWith('note1', 'New Task', undefined)
  })

  it('🔄 toggles task completion', () => {
    const { container } = render(
      <ProjectProvider value={mockProjectContext}>
        <TaskManager />
      </ProjectProvider>
    )

    const checkbox = screen.getByTestId('task-checkbox-1')
    fireEvent.click(checkbox)

    expect(mockProjectContext.updateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ completed: true })
    )

    // Mock the task as completed
    mockProjectContext.notes[0].tasks[0].completed = true
    fireEvent.click(checkbox)

    expect(mockProjectContext.updateTask).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({ completed: false })
    )
  })

  it('🗑 deletes task when clicking delete button', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    fireEvent.click(screen.getByTestId('delete-task-1'))

    expect(mockProjectContext.deleteTask).toHaveBeenCalledWith('1')
  })

  it('📅 displays due date correctly', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    const dateElement = screen.getByTestId('task-date-1')
    expect(dateElement.textContent).toContain('23/11/2024')
  })

  it('🎨 applies correct styles for completed tasks', () => {
    renderWithProviders(<TaskManager noteId="note1" />)

    const completedTaskText = screen.getByText('Test Task 2').closest('.MuiListItemText-root')
    expect(completedTaskText).toHaveStyle({ textDecoration: 'line-through' })
  })
})
