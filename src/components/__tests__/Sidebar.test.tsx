import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Sidebar } from '../Sidebar';
import { ProjectProvider } from '../../contexts/ProjectContext';

// Mock des données
const mockProjects = [
  { id: '1', name: 'Project 1', color: '#ff0000' },
  { id: '2', name: 'Project 2', color: '#00ff00' }
];

const mockNotes = [
  { id: '1', title: 'Note 1', content: 'Content 1', projectId: '1' },
  { id: '2', title: 'Note 2', content: 'Content 2', projectId: '1' }
];

// Mock du contexte Project
const mockProjectContext = {
  projects: mockProjects,
  notes: mockNotes,
  currentProject: mockProjects[0],
  currentNote: mockNotes[0],
  createProject: jest.fn(),
  createNote: jest.fn(),
  deleteProject: jest.fn(),
  deleteNote: jest.fn(),
  setCurrentProject: jest.fn(),
  setCurrentNote: jest.fn(),
};

jest.mock('../../contexts/ProjectContext', () => ({
  ProjectProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="project-provider">{children}</div>
  ),
  useProject: () => mockProjectContext,
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <ProjectProvider>
      {component}
    </ProjectProvider>
  );
};

describe('Sidebar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render sidebar sections', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('PROJETS')).toBeInTheDocument();
  });

  it('should display projects in sidebar', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Project 1')).toBeInTheDocument();
    expect(screen.getByText('Project 2')).toBeInTheDocument();
  });

  it('should handle project creation', () => {
    renderWithProviders(<Sidebar />);
    
    const addButton = screen.getByTestId('add-project-button');
    fireEvent.click(addButton);
    
    expect(mockProjectContext.createProject).toHaveBeenCalledWith('Nouveau projet');
  });

  it('should display notes for current project', () => {
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Note 1')).toBeInTheDocument();
    expect(screen.getByText('Note 2')).toBeInTheDocument();
  });

  it('should handle note creation', () => {
    renderWithProviders(<Sidebar />);
    
    const addButton = screen.getByTestId('add-note-button');
    fireEvent.click(addButton);
    
    expect(mockProjectContext.createNote).toHaveBeenCalledWith('1', 'Nouvelle note');
  });

  it('should handle project selection', () => {
    renderWithProviders(<Sidebar />);
    
    const project = screen.getByText('Project 2');
    fireEvent.click(project);
    
    expect(mockProjectContext.setCurrentProject).toHaveBeenCalledWith('2');
  });

  it('should handle note selection', () => {
    renderWithProviders(<Sidebar />);
    
    const note = screen.getByText('Note 2');
    fireEvent.click(note);
    
    expect(mockProjectContext.setCurrentNote).toHaveBeenCalledWith('2');
  });
});
