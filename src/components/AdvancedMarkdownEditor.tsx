import React, { useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useCodeMirror } from '@uiw/react-codemirror';
import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { searchKeymap, search, highlightSelectionMatches } from '@codemirror/search';
import { autocompletion, closeBrackets } from '@codemirror/autocomplete';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { lineNumbers, highlightActiveLineGutter, EditorView, rectangularSelection, crosshairCursor, keymap } from '@codemirror/view';
import { EditorState, EditorSelection } from '@codemirror/state'; 
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeKatex from 'rehype-katex';
import { Box, IconButton, Toolbar, Tooltip, Paper, Divider } from '@mui/material';
import { FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered, Code, Functions, Timeline, PictureAsPdf } from '@mui/icons-material';
import { useProject } from '../contexts/ProjectContext';

interface AdvancedMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  distractionFree?: boolean;
  noteId?: string;
}

export const AdvancedMarkdownEditor: React.FC<AdvancedMarkdownEditorProps> = ({
  value,
  onChange,
  distractionFree: distraction = false,
  noteId,
}) => {
  const { isDarkMode } = useTheme();
  const { exportNoteToPDF } = useProject();
  const editorRef = useRef<HTMLDivElement>(null);
  const showLineNumbers = !distraction;

  const extensions = [
    markdown({
      base: markdownLanguage,
      codeLanguages: languages,
    }),
    history(),
    autocompletion(),
    search(),
    keymap.of([
      ...defaultKeymap,
      ...historyKeymap,
      ...searchKeymap,
    ]),
    EditorView.lineWrapping,
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    rectangularSelection(),
    crosshairCursor(),
    highlightSelectionMatches(),
    EditorView.theme({
      '&': {
        height: '100%',
      },
      '.cm-scroller': {
        overflow: 'auto',
      },
      '.cm-content': {
        fontFamily: 'monospace',
        padding: distraction ? '20px' : '10px',
        color: isDarkMode ? '#d6d3d1' : '#1c1917',
        maxWidth: distraction ? '700px' : 'none',
        margin: distraction ? '0 auto' : '0',
      },
      '.cm-line': {
        padding: '0 4px',
        lineHeight: '1.6',
      },
      '.cm-cursor': {
        borderLeftColor: isDarkMode ? '#d6d3d1' : '#1c1917',
        borderLeftWidth: '2px',
        marginLeft: '-1px',
      },
      '.cm-gutters': {
        backgroundColor: isDarkMode ? '#292524' : '#78716c',
        color: isDarkMode ? '#78716c' : '#44403c',
        border: 'none',
      },
      '.cm-activeLineGutter': {
        backgroundColor: isDarkMode ? '#292524' : '#78716c',
      },
      '.cm-activeLine': {
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      },
    }),
  ];

  if (showLineNumbers) {
    extensions.push(lineNumbers());
    extensions.push(highlightActiveLineGutter());
  }

  const { setContainer, view } = useCodeMirror({
    container: editorRef.current,
    extensions,
    value,
    height: '100%',
    autoFocus: true,
    theme: isDarkMode ? 'dark' : 'light',
    onChange: (value) => onChange(value),
  });

  useEffect(() => {
    if (editorRef.current) {
      setContainer(editorRef.current);
    }
  }, [setContainer]);

  useEffect(() => {
    if (view) {
      view.focus();
    }
  }, [view]);

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    if (!view) return;
    
    const selection = view.state.selection.main;
    const text = view.state.doc.sliceString(selection.from, selection.to);
    
    view.dispatch({
      changes: {
        from: selection.from,
        to: selection.to,
        insert: `${prefix}${text}${suffix}`,
      },
    });
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {!distraction && (
        <Paper
          elevation={0}
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            flexShrink: 0,
          }}
        >
          <Toolbar variant="dense">
            <Tooltip title="Gras">
              <IconButton onClick={() => insertMarkdown('**', '**')}>
                <FormatBold />
              </IconButton>
            </Tooltip>
            <Tooltip title="Italique">
              <IconButton onClick={() => insertMarkdown('*', '*')}>
                <FormatItalic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Liste à puces">
              <IconButton onClick={() => insertMarkdown('- ')}>
                <FormatListBulleted />
              </IconButton>
            </Tooltip>
            <Tooltip title="Liste numérotée">
              <IconButton onClick={() => insertMarkdown('1. ')}>
                <FormatListNumbered />
              </IconButton>
            </Tooltip>
            <Tooltip title="Code">
              <IconButton onClick={() => insertMarkdown('`', '`')}>
                <Code />
              </IconButton>
            </Tooltip>
            <Tooltip title="Formule mathématique">
              <IconButton onClick={() => insertMarkdown('$', '$')}>
                <Functions />
              </IconButton>
            </Tooltip>
            <Tooltip title="Diagramme">
              <IconButton onClick={() => insertMarkdown('\n```mermaid\n', '\n```\n')}>
                <Timeline />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </Paper>
      )}
      <Box
        ref={editorRef}
        sx={{
          flexGrow: 1,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          '& .cm-editor': {
            height: '100%',
          },
        }}
      />
    </Box>
  );
};

export default AdvancedMarkdownEditor;
