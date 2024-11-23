import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SplitView } from '../SplitView';
import { WorkspaceProvider } from '../../contexts/WorkspaceContext';
import { invoke } from '@tauri-apps/api/tauri';

jest.mock('@tauri-apps/api/tauri', () => ({
  invoke: jest.fn(),
}));

// Mock du contexte Workspace
const mockWorkspaceContext = {
  workspaces: [],
  currentWorkspace: null,
  currentTab: {
    id: '1',
    title: 'Test Tab',
    content: <div>Tab Content</div>
  },
  addWorkspace: jest.fn(),
  switchWorkspace: jest.fn(),
  updateWorkspaceSettings: jest.fn(),
  setCurrentTab: jest.fn(),
};

jest.mock('../../contexts/WorkspaceContext', () => ({
  WorkspaceProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="workspace-provider">{children}</div>
  ),
  useWorkspace: () => mockWorkspaceContext,
}));

describe('SplitView', () => {
  const mockTabs = [
    { id: '1', title: 'Tab 1', content: 'Content 1', type: 'markdown' },
    { id: '2', title: 'Tab 2', content: 'Content 2', type: 'markdown' },
    { id: '3', title: 'Tab 3', content: 'Content 3', type: 'markdown' },
    { id: '4', title: 'Tab 4', content: 'Content 4', type: 'markdown' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (invoke as jest.Mock).mockResolvedValueOnce(mockTabs);
  });

  it('renders both panels with default split ratio', () => {
    const leftContent = <div>Left Panel</div>
    const rightContent = <div>Right Panel</div>

    render(
      <WorkspaceProvider>
        <SplitView
          left={leftContent}
          right={rightContent}
        />
      </WorkspaceProvider>
    )

    expect(screen.getByText('Left Panel')).toBeInTheDocument()
    expect(screen.getByText('Right Panel')).toBeInTheDocument()
  })

  it('applies custom split ratio', () => {
    const { container } = render(
      <WorkspaceProvider>
        <SplitView ratio={70}>
          <div>Left Panel</div>
          <div>Right Panel</div>
        </SplitView>
      </WorkspaceProvider>
    )

    const leftPanel = container.firstChild?.firstChild as HTMLElement
    const rightPanel = container.firstChild?.lastChild as HTMLElement

    expect(leftPanel).toHaveStyle({ flexBasis: '70%' })
    expect(rightPanel).toHaveStyle({ flexBasis: '30%' })
  })

  it('should render split view container', () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Left Panel</div>
          <div>Right Panel</div>
        </SplitView>
      </WorkspaceProvider>
    );

    expect(screen.getByTestId('split-view')).toBeInTheDocument();
  });

  it('should handle horizontal split', async () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const splitButton = screen.getByTestId('split-horizontal-btn');
    fireEvent.click(splitButton);

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels).toHaveLength(2);
      expect(panels[0]).toHaveStyle({ height: '50%' });
      expect(panels[1]).toHaveStyle({ height: '50%' });
    });
  });

  it('should handle vertical split', async () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const splitButton = screen.getByTestId('split-vertical-btn');
    fireEvent.click(splitButton);

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels).toHaveLength(2);
      expect(panels[0]).toHaveStyle({ width: '50%' });
      expect(panels[1]).toHaveStyle({ width: '50%' });
    });
  });

  it('should handle quad split', async () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const quadSplitButton = screen.getByTestId('split-quad-btn');
    fireEvent.click(quadSplitButton);

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels).toHaveLength(4);
      panels.forEach(panel => {
        expect(panel).toHaveStyle({ width: '50%', height: '50%' });
      });
    });
  });

  it('should allow dragging divider to resize splits', async () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const splitButton = screen.getByTestId('split-horizontal-btn');
    fireEvent.click(splitButton);

    const divider = screen.getByTestId('split-divider');
    
    fireEvent.mouseDown(divider);
    fireEvent.mouseMove(divider, { clientY: 300 });
    fireEvent.mouseUp(divider);

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels[0]).toHaveStyle({ height: '60%' });
      expect(panels[1]).toHaveStyle({ height: '40%' });
    });
  });

  it('should handle tab drag and drop between splits', async () => {
    render(
      <WorkspaceProvider>
        <SplitView>
          <div data-testid="tab-1">Tab 1</div>
          <div data-testid="tab-2">Tab 2</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const quadSplitButton = screen.getByTestId('split-quad-btn');
    fireEvent.click(quadSplitButton);

    const tab = screen.getByTestId('tab-1');
    const targetPanel = screen.getAllByTestId('split-panel')[2];

    fireEvent.dragStart(tab);
    fireEvent.drop(targetPanel);

    expect(targetPanel).toContainElement(tab);
  });

  it('should save split layout configuration', async () => {
    const { rerender } = render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    const splitButton = screen.getByTestId('split-horizontal-btn');
    fireEvent.click(splitButton);

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels).toHaveLength(2);
    });

    // Simulate component unmount and remount
    rerender(<div />);
    rerender(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    // Check if layout is restored
    const panels = screen.getAllByTestId('split-panel');
    expect(panels).toHaveLength(2);
  });

  it('should restore previous split layout', async () => {
    // Setup mock local storage data
    const mockLayout = {
      direction: 'horizontal',
      sizes: [60, 40],
      children: []
    };
    localStorage.setItem('splitLayout', JSON.stringify(mockLayout));

    render(
      <WorkspaceProvider>
        <SplitView>
          <div>Content</div>
        </SplitView>
      </WorkspaceProvider>
    );

    await waitFor(() => {
      const panels = screen.getAllByTestId('split-panel');
      expect(panels).toHaveLength(2);
      expect(panels[0]).toHaveStyle({ height: '60%' });
      expect(panels[1]).toHaveStyle({ height: '40%' });
    });
  });

  it('renders left and right content', () => {
    const leftContent = <div>Left Content</div>;
    const rightContent = <div>Right Content</div>;

    render(
      <WorkspaceProvider>
        <SplitView
          left={leftContent}
          right={rightContent}
          splitRatio={0.5}
        />
      </WorkspaceProvider>
    );

    expect(screen.getByText('Left Content')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('renders current tab content when no right content is provided', () => {
    const leftContent = <div>Left Content</div>;

    render(
      <WorkspaceProvider>
        <SplitView left={leftContent} splitRatio={0.5} />
      </WorkspaceProvider>
    );

    expect(screen.getByText('Left Content')).toBeInTheDocument();
    expect(screen.getByText('Tab Content')).toBeInTheDocument();
  });

  it('should render with default split ratio', () => {
    render(
      <WorkspaceProvider>
        <SplitView 
          left={<div>Left Content</div>}
          right={<div>Right Content</div>}
        />
      </WorkspaceProvider>
    );
    
    expect(screen.getByText('Left Content')).toBeInTheDocument();
    expect(screen.getByText('Right Content')).toBeInTheDocument();
  });

  it('should render with custom split ratio', () => {
    render(
      <WorkspaceProvider>
        <SplitView 
          left={<div>Left Content</div>}
          right={<div>Right Content</div>}
          splitRatio={0.7}
        />
      </WorkspaceProvider>
    );

    const leftPanel = screen.getByText('Left Content').parentElement;
    const rightPanel = screen.getByText('Right Content').parentElement;
    
    expect(leftPanel).toHaveStyle({ width: '70%' });
    expect(rightPanel).toHaveStyle({ width: '30%' });
  });
});
