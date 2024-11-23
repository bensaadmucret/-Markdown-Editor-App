import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { Add as AddIcon, MoreVert as MoreVertIcon } from '@mui/icons-material';
import { invoke } from '@tauri-apps/api/tauri';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { v4 as uuidv4 } from 'uuid';

interface TabData {
  id: string;
  title: string;
  content?: string;
  type: string;
  position: number;
  isActive: boolean;
}

export const TabManager: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [tabs, setTabs] = useState<TabData[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTab, setSelectedTab] = useState<TabData | null>(null);

  useEffect(() => {
    if (currentWorkspace) {
      loadTabs();
    }
  }, [currentWorkspace]);

  const loadTabs = async () => {
    if (currentWorkspace) {
      try {
        const workspaceTabs = await invoke('get_workspace_tabs', {
          workspaceId: currentWorkspace.id,
        }) as TabData[];
        setTabs(workspaceTabs);
        
        const activeTab = workspaceTabs.find(tab => tab.isActive);
        if (activeTab) {
          setActiveTab(activeTab.id);
        }
      } catch (error) {
        console.error('Error loading tabs:', error);
      }
    }
  };

  const handleTabChange = async (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    try {
      await invoke('update_tab_active_state', {
        tabId: newValue,
        isActive: true,
      });
    } catch (error) {
      console.error('Error updating tab state:', error);
    }
  };

  const handleAddTab = async () => {
    const newTab: TabData = {
      id: uuidv4(),
      title: 'Nouvel onglet',
      type: 'markdown',
      position: tabs.length,
      isActive: true,
    };

    try {
      await invoke('create_tab', {
        tab: newTab,
        workspaceId: currentWorkspace?.id,
      });
      setTabs([...tabs, newTab]);
      setActiveTab(newTab.id);
    } catch (error) {
      console.error('Error creating new tab:', error);
    }
  };

  const handleTabMenuClick = (event: React.MouseEvent<HTMLElement>, tab: TabData) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedTab(tab);
  };

  const handleTabMenuClose = () => {
    setAnchorEl(null);
    setSelectedTab(null);
  };

  const handleCloseTab = async () => {
    if (selectedTab) {
      try {
        await invoke('delete_tab', {
          tabId: selectedTab.id,
        });
        setTabs(tabs.filter(tab => tab.id !== selectedTab.id));
        if (activeTab === selectedTab.id) {
          const remainingTabs = tabs.filter(tab => tab.id !== selectedTab.id);
          if (remainingTabs.length > 0) {
            setActiveTab(remainingTabs[0].id);
          } else {
            setActiveTab(null);
          }
        }
      } catch (error) {
        console.error('Error closing tab:', error);
      }
    }
    handleTabMenuClose();
  };

  const handleDuplicateTab = async () => {
    if (selectedTab) {
      const newTab: TabData = {
        ...selectedTab,
        id: uuidv4(),
        title: `${selectedTab.title} (copie)`,
        position: tabs.length,
        isActive: false,
      };

      try {
        await invoke('create_tab', {
          tab: newTab,
          workspaceId: currentWorkspace?.id,
        });
        setTabs([...tabs, newTab]);
      } catch (error) {
        console.error('Error duplicating tab:', error);
      }
    }
    handleTabMenuClose();
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ flex: 1 }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              value={tab.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {tab.title}
                  <IconButton
                    size="small"
                    onClick={(e) => handleTabMenuClick(e, tab)}
                    sx={{ ml: 1 }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              }
            />
          ))}
        </Tabs>
        <Tooltip title="Nouvel onglet">
          <IconButton onClick={handleAddTab} sx={{ ml: 1 }}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleTabMenuClose}
      >
        <MenuItem onClick={handleCloseTab}>Fermer</MenuItem>
        <MenuItem onClick={handleDuplicateTab}>Dupliquer</MenuItem>
      </Menu>
    </Box>
  );
};

export default TabManager;
