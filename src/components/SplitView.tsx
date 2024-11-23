import React, { useState, useCallback } from 'react';
import { Box, IconButton, Paper } from '@mui/material';
import { DragHandle as DragHandleIcon } from '@mui/icons-material';
import { useWorkspace } from '../contexts/WorkspaceContext';
import { useTheme } from '../contexts/ThemeContext';

interface SplitViewProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  initialSplitRatio?: number;
  minWidth?: number;
  orientation?: 'horizontal' | 'vertical';
}

export const SplitView: React.FC<SplitViewProps> = ({
  left = null,
  right = null,
  initialSplitRatio = 0.5,
  minWidth = 200,
  orientation = 'vertical',
}) => {
  const { currentTab } = useWorkspace();
  const { isDarkMode } = useTheme();
  const [splitRatio, setSplitRatio] = useState(initialSplitRatio);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);

    const handleDrag = (e: MouseEvent) => {
      const container = (e.target as HTMLElement).closest('.split-view-container');
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const newRatio = orientation === 'vertical'
        ? (e.clientX - rect.left) / rect.width
        : (e.clientY - rect.top) / rect.height;

      // Limiter le ratio pour respecter la largeur minimale
      const containerSize = orientation === 'vertical' ? rect.width : rect.height;
      const minRatio = minWidth / containerSize;
      const maxRatio = 1 - minRatio;

      setSplitRatio(Math.min(Math.max(newRatio, minRatio), maxRatio));
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleDrag);
      window.removeEventListener('mouseup', handleDragEnd);
    };

    window.addEventListener('mousemove', handleDrag);
    window.addEventListener('mouseup', handleDragEnd);
  }, [orientation, minWidth]);

  return (
    <Box
      className="split-view-container"
      sx={{
        display: 'flex',
        flexDirection: orientation === 'vertical' ? 'row' : 'column',
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          width: orientation === 'vertical' ? `${splitRatio * 100}%` : '100%',
          height: orientation === 'vertical' ? '100%' : `${splitRatio * 100}%`,
          overflow: 'auto',
        }}
      >
        {left}
      </Box>

      {/* Séparateur draggable */}
      <Paper
        elevation={isDragging ? 4 : 1}
        onMouseDown={handleDragStart}
        sx={{
          position: 'relative',
          cursor: orientation === 'vertical' ? 'col-resize' : 'row-resize',
          backgroundColor: isDarkMode ? 'grey.800' : 'grey.200',
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: isDarkMode ? 'grey.700' : 'grey.300',
          },
          ...(orientation === 'vertical' ? {
            width: '6px',
            height: '100%',
            margin: '0 -3px',
            zIndex: 1,
          } : {
            width: '100%',
            height: '6px',
            margin: '-3px 0',
            zIndex: 1,
          }),
        }}
      >
        <IconButton
          size="small"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: orientation === 'vertical' 
              ? 'translate(-50%, -50%)' 
              : 'translate(-50%, -50%) rotate(90deg)',
            opacity: 0.7,
            '&:hover': { opacity: 1 },
          }}
        >
          <DragHandleIcon />
        </IconButton>
      </Paper>

      <Box
        sx={{
          width: orientation === 'vertical' ? `${(1 - splitRatio) * 100}%` : '100%',
          height: orientation === 'vertical' ? '100%' : `${(1 - splitRatio) * 100}%`,
          overflow: 'auto',
        }}
      >
        {right || currentTab?.content}
      </Box>
    </Box>
  );
};
