import React, { useState, useEffect } from 'react';
import { Box, IconButton, Paper, Tooltip } from '@mui/material';
import { VisibilityOutlined, VisibilityOff, ViewColumn, ViewStream, PictureAsPdf } from '@mui/icons-material';
import { AdvancedMarkdownEditor } from './AdvancedMarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { useProject } from '../contexts/ProjectContext';

interface MarkdownWorkspaceProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  distractionFree?: boolean;
  noteId?: string;
}

const validateProps = (props: MarkdownWorkspaceProps) => {
  if (props.initialValue && typeof props.initialValue !== 'string') {
    console.error('MarkdownWorkspace: initialValue must be a string');
    return false;
  }
  if (props.onChange && typeof props.onChange !== 'function') {
    console.error('MarkdownWorkspace: onChange must be a function');
    return false;
  }
  if (props.distractionFree && typeof props.distractionFree !== 'boolean') {
    console.error('MarkdownWorkspace: distractionFree must be a boolean');
    return false;
  }
  return true;
};

export const MarkdownWorkspace: React.FC<MarkdownWorkspaceProps> = ({
  initialValue = '',
  onChange,
  distractionFree: initialDistractionFree = false,
  noteId,
}) => {
  if (!validateProps({ initialValue, onChange, distractionFree: initialDistractionFree })) {
    return null;
  }

  const { exportNoteToPDF } = useProject();
  console.log('MarkdownWorkspace noteId:', noteId);

  const [markdown, setMarkdown] = useState(initialValue);
  const [showPreview, setShowPreview] = useState(true);
  const [splitVertical, setSplitVertical] = useState(true);
  const [distractionFree, setDistractionFree] = useState(initialDistractionFree);

  useEffect(() => {
    setDistractionFree(initialDistractionFree);
  }, [initialDistractionFree]);

  const handleChange = (value: string) => {
    setMarkdown(value);
    if (onChange) {
      try {
        onChange(value);
      } catch (error) {
        console.error('Error in onChange handler:', error);
      }
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const toggleSplitOrientation = () => {
    setSplitVertical(!splitVertical);
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {!distractionFree && (
        <Paper
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 0.5,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Changer l'orientation">
              <IconButton onClick={toggleSplitOrientation} size="small">
                {splitVertical ? <ViewColumn /> : <ViewStream />}
              </IconButton>
            </Tooltip>
            <Tooltip title={showPreview ? 'Masquer la prévisualisation' : 'Afficher la prévisualisation'}>
              <IconButton onClick={togglePreview} size="small">
                {showPreview ? <VisibilityOff /> : <VisibilityOutlined />}
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
            <Tooltip title="Exporter en PDF">
              <span>
                <IconButton 
                  onClick={() => {
                    console.log('Export PDF clicked, noteId:', noteId);
                    if (noteId) {
                      exportNoteToPDF(noteId);
                    }
                  }}
                  disabled={!noteId}
                  size="small"
                >
                  <PictureAsPdf fontSize="small" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Paper>
      )}

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: splitVertical ? 'row' : 'column',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            flex: showPreview ? 1 : '1 1 100%',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <AdvancedMarkdownEditor
            value={markdown}
            onChange={handleChange}
            distractionFree={distractionFree}
          />
        </Box>

        {showPreview && (
          <Box
            sx={{
              flex: 1,
              borderLeft: splitVertical ? 1 : 0,
              borderTop: !splitVertical ? 1 : 0,
              borderColor: 'divider',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <MarkdownPreview markdown={markdown} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
