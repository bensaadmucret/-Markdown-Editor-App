import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppThemeOptions } from '../theme/theme';

export interface WorkspaceProfile {
  id: string;
  name: string;
  theme: Partial<AppThemeOptions>;
  settings: {
    defaultView: 'split' | 'single';
    splitOrientation: 'horizontal' | 'vertical';
    splitRatio: number;
    showLineNumbers: boolean;
    autoSave: boolean;
    spellCheck: boolean;
    fontSize: number;
    fontFamily: string;
    tabSize: number;
    useSoftTabs: boolean;
    lineHeight: number;
    showInvisibles: boolean;
    wordWrap: boolean;
  };
}

export interface Workspace {
  id: string;
  name: string;
  path: string;
  currentProfileId: string;
  profiles: WorkspaceProfile[];
}

interface WorkspaceContextType {
  workspaces: Workspace[];
  currentWorkspace: Workspace | null;
  currentProfile: WorkspaceProfile | null;
  addWorkspace: (name: string, path: string) => void;
  removeWorkspace: (id: string) => void;
  switchWorkspace: (id: string) => void;
  addProfile: (workspaceId: string, profile: Omit<WorkspaceProfile, 'id'>) => void;
  updateProfile: (workspaceId: string, profileId: string, updates: Partial<WorkspaceProfile>) => void;
  removeProfile: (workspaceId: string, profileId: string) => void;
  switchProfile: (workspaceId: string, profileId: string) => void;
  duplicateProfile: (workspaceId: string, profileId: string, newName: string) => void;
}

const defaultProfile: Omit<WorkspaceProfile, 'id' | 'name'> = {
  theme: {
    isDarkMode: false,
    backgroundColor: '#ffffff',
    sidebarColor: '#f5f5f5',
    buttonColor: '#2196f3',
    fontSize: 14,
    accentColor: '#2196f3',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    borderRadius: 4,
    spacing: 8,
  },
  settings: {
    defaultView: 'single',
    splitOrientation: 'vertical',
    splitRatio: 0.5,
    showLineNumbers: true,
    autoSave: true,
    spellCheck: true,
    fontSize: 14,
    fontFamily: 'Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace',
    tabSize: 2,
    useSoftTabs: true,
    lineHeight: 1.5,
    showInvisibles: false,
    wordWrap: true,
  },
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const STORAGE_KEY = 'markdownEditor.workspaces';

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [currentProfile, setCurrentProfile] = useState<WorkspaceProfile | null>(null);

  // Sauvegarder les workspaces dans le localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
  }, [workspaces]);

  // Mettre à jour le profil courant quand le workspace change
  useEffect(() => {
    if (currentWorkspace) {
      const profile = currentWorkspace.profiles.find(
        p => p.id === currentWorkspace.currentProfileId
      );
      setCurrentProfile(profile || null);
    } else {
      setCurrentProfile(null);
    }
  }, [currentWorkspace]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addWorkspace = (name: string, path: string) => {
    const defaultProfileId = generateId();
    const newWorkspace: Workspace = {
      id: generateId(),
      name,
      path,
      currentProfileId: defaultProfileId,
      profiles: [{
        id: defaultProfileId,
        name: 'Default',
        ...defaultProfile
      }],
    };
    setWorkspaces(prev => [...prev, newWorkspace]);
    setCurrentWorkspace(newWorkspace);
  };

  const removeWorkspace = (id: string) => {
    setWorkspaces(prev => prev.filter(w => w.id !== id));
    if (currentWorkspace?.id === id) {
      setCurrentWorkspace(null);
    }
  };

  const switchWorkspace = (id: string) => {
    const workspace = workspaces.find(w => w.id === id);
    setCurrentWorkspace(workspace || null);
  };

  const addProfile = (workspaceId: string, profile: Omit<WorkspaceProfile, 'id'>) => {
    const newProfile: WorkspaceProfile = {
      ...profile,
      id: generateId(),
    };

    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          profiles: [...workspace.profiles, newProfile],
        };
      }
      return workspace;
    }));
  };

  const updateProfile = (workspaceId: string, profileId: string, updates: Partial<WorkspaceProfile>) => {
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          profiles: workspace.profiles.map(profile => {
            if (profile.id === profileId) {
              return { ...profile, ...updates };
            }
            return profile;
          }),
        };
      }
      return workspace;
    }));
  };

  const removeProfile = (workspaceId: string, profileId: string) => {
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id === workspaceId) {
        // Ne pas supprimer le dernier profil
        if (workspace.profiles.length <= 1) {
          return workspace;
        }

        // Si le profil courant est supprimé, basculer vers un autre
        const newProfiles = workspace.profiles.filter(p => p.id !== profileId);
        return {
          ...workspace,
          profiles: newProfiles,
          currentProfileId: workspace.currentProfileId === profileId
            ? newProfiles[0].id
            : workspace.currentProfileId,
        };
      }
      return workspace;
    }));
  };

  const switchProfile = (workspaceId: string, profileId: string) => {
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id === workspaceId) {
        return {
          ...workspace,
          currentProfileId: profileId,
        };
      }
      return workspace;
    }));
  };

  const duplicateProfile = (workspaceId: string, profileId: string, newName: string) => {
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id === workspaceId) {
        const profileToDuplicate = workspace.profiles.find(p => p.id === profileId);
        if (profileToDuplicate) {
          const newProfile: WorkspaceProfile = {
            ...profileToDuplicate,
            id: generateId(),
            name: newName,
          };
          return {
            ...workspace,
            profiles: [...workspace.profiles, newProfile],
          };
        }
      }
      return workspace;
    }));
  };

  const value = {
    workspaces,
    currentWorkspace,
    currentProfile,
    addWorkspace,
    removeWorkspace,
    switchWorkspace,
    addProfile,
    updateProfile,
    removeProfile,
    switchProfile,
    duplicateProfile,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};
