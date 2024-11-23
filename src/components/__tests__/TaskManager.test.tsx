import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { TaskManager } from '../TaskManager'
import { ProjectProvider } from '../../contexts/ProjectContext'
import { ThemeProvider } from '@mui/material'
import { gruvboxTheme } from '../../theme/gruvbox'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr } from 'date-fns/locale'

// Mock des données de test
const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    completed: false,
    noteId: 'note1',
  },
  {
    id: '2',
    title: 'Test Task 2',
    completed: true,
    noteId: 'note1',
    dueDate: new Date('2024-01-01'),
  },
]

const mockNote = {
  id: 'note1',
  title: 'Test Note',
  content: '',
  projectId: '1',
  tags: [],
  tasks: mockTasks,
}

const mockContext = {
  notes: [mockNote],
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}

// Mock du hook useProject
jest.mock('../../contexts/ProjectContext', () => ({
  ...jest.requireActual('../../contexts/ProjectContext'),
  useProject: () => mockContext,
}))

describe('✅ TaskManager Component', () => {
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

  it('🎯 renders task list correctly', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    expect(screen.getByText('Test Task 1')).toBeInTheDocument()
    expect(screen.getByText('Test Task 2')).toBeInTheDocument()
  })

  it('✨ creates new task when submitting form', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    const input = screen.getByPlaceholderText('Nouvelle tâche')
    fireEvent.change(input, { target: { value: 'New Task' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 'Enter' })
    
    expect(mockContext.createTask).toHaveBeenCalledWith(
      'note1',
      'New Task',
      undefined
    )
  })

  it('🔄 toggles task completion', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    const checkbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(checkbox)
    
    expect(mockContext.updateTask).toHaveBeenCalledWith('1', { completed: true })
  })

  it('🗑 deletes task when clicking delete button', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i })
    fireEvent.click(deleteButtons[0])
    
    expect(mockContext.deleteTask).toHaveBeenCalledWith('1')
  })

  it('📅 displays due date correctly', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    // La date devrait être affichée au format local
    expect(screen.getByText('01/01/2024')).toBeInTheDocument()
  })

  it('🎨 applies correct styles for completed tasks', () => {
    renderWithProviders(<TaskManager noteId="note1" />)
    
    const completedTask = screen.getByText('Test Task 2')
    expect(completedTask).toHaveStyle({ textDecoration: 'line-through' })
  })
})
