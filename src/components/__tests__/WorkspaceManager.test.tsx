import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkspaceManager from '../WorkspaceManager';
import { WorkspaceProvider } from '../../contexts/WorkspaceContext';
import { invoke } from '@tauri-apps/api/tauri';

// Mock Tauri's invoke function
jest.mock('@tauri-apps/api/tauri', () => ({
  invoke: jest.fn(),
}));

describe('WorkspaceManager', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should render workspace creation button', () => {
    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );
    
    expect(screen.getByText('Nouvel espace')).toBeInTheDocument();
  });

  it('should open workspace creation dialog when clicking new workspace button', () => {
    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );
    
    fireEvent.click(screen.getByText('Nouvel espace'));
    expect(screen.getByText('Créer un nouvel espace')).toBeInTheDocument();
  });

  it('should create a new workspace', async () => {
    (invoke as jest.Mock).mockResolvedValueOnce(undefined);

    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );
    
    // Open dialog
    fireEvent.click(screen.getByText('Nouvel espace'));
    
    // Fill form
    const nameInput = screen.getByLabelText('Nom');
    fireEvent.change(nameInput, { target: { value: 'Espace de travail' } });
    
    // Select type
    const typeSelect = screen.getByTestId('workspace-type-select');
    fireEvent.mouseDown(typeSelect);
    fireEvent.click(screen.getByText('Travail'));
    
    // Select color
    const colorPicker = screen.getByTestId('workspace-color-picker');
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
    
    // Select privacy level
    const privacySelect = screen.getByTestId('workspace-privacy-select');
    fireEvent.mouseDown(privacySelect);
    fireEvent.click(screen.getByText('Moyen'));
    
    // Select shared view
    const sharedViewSwitch = screen.getByRole('checkbox', { name: 'Vue partagée' });
    fireEvent.click(sharedViewSwitch);
    
    // Submit form
    fireEvent.click(screen.getByText('Créer'));
    
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('create_workspace', expect.any(Object));
    });
  });

  it('should display workspace settings', async () => {
    const mockWorkspace = {
      id: '1',
      name: 'Espace de travail',
      type: 'work',
      settings: {
        darkMode: false,
        splitView: true,
        privacyLevel: 'high',
      },
    };

    (invoke as jest.Mock).mockResolvedValueOnce([mockWorkspace]);

    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Espace de travail')).toBeInTheDocument();
      expect(screen.getByText('Type: work')).toBeInTheDocument();
      expect(screen.getByLabelText('Vue partagée')).toBeInTheDocument();
    });
  });

  it('should handle workspace color selection', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );
    
    fireEvent.click(screen.getByText('Nouvel espace'));
    
    const colorPicker = screen.getByTestId('workspace-color-picker');
    fireEvent.change(colorPicker, { target: { value: '#ff0000' } });
    
    expect(colorPicker).toHaveValue('#ff0000');
  });

  it('should handle workspace privacy level selection', async () => {
    render(
      <WorkspaceProvider>
        <WorkspaceManager />
      </WorkspaceProvider>
    );
    
    fireEvent.click(screen.getByText('Nouvel espace'));
    
    const privacySelect = screen.getByTestId('workspace-privacy-select');
    fireEvent.mouseDown(privacySelect);
    fireEvent.click(screen.getByText('Moyen'));
    
    expect(screen.getByText('Moyen')).toBeInTheDocument();
  });
});
