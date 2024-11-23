import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkToc from 'remark-toc';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import { Box, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import 'katex/dist/katex.min.css';

interface MarkdownPreviewProps {
  markdown: string;
  className?: string;
}

// Initialize mermaid with dark/light theme support
const initMermaid = (isDarkMode: boolean) => {
  mermaid.initialize({
    startOnLoad: true,
    theme: isDarkMode ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'monospace',
    flowchart: {
      htmlLabels: true,
      curve: 'linear',
    },
  });
};

const ErrorMessage: React.FC<{ error: string }> = ({ error }) => (
  <Box
    sx={{
      padding: 2,
      backgroundColor: theme => theme.palette.error.light,
      color: theme => theme.palette.error.contrastText,
      borderRadius: 1,
      marginY: 1,
    }}
  >
    {error}
  </Box>
);

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  markdown,
  className,
}) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  const [mermaidError, setMermaidError] = useState<string | null>(null);
  const [katexError, setKatexError] = useState<string | null>(null);

  // Initialize mermaid when theme changes
  useEffect(() => {
    initMermaid(isDarkMode);
  }, [isDarkMode]);

  // Re-render mermaid diagrams when markdown changes
  useEffect(() => {
    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Mermaid content loaded error:', error);
    }
  }, [markdown]);

  const renderMermaidDiagram = React.useCallback((code: string) => {
    try {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const container = document.createElement('div');
      container.id = id;
      container.className = 'mermaid';
      container.style.textAlign = 'center';
      container.style.padding = '1rem';
      
      // Nettoyer le code Mermaid
      const cleanCode = code
        .trim()
        .replace(/^\s*```mermaid\s*/, '')
        .replace(/\s*```\s*$/, '')
        .trim();
      
      if (!cleanCode) {
        throw new Error('Empty diagram code');
      }

      // Réinitialiser Mermaid pour le nouveau diagramme
      mermaid.initialize({
        startOnLoad: true,
        theme: theme.palette.mode === 'dark' ? 'dark' : 'default',
        securityLevel: 'loose',
        fontFamily: 'monospace',
        flowchart: {
          htmlLabels: true,
          curve: 'linear',
        },
      });
      
      return new Promise((resolve) => {
        mermaid.render(id, cleanCode).then(
          ({ svg }) => {
            container.innerHTML = svg;
            setMermaidError(null);
            resolve(<div ref={(node) => node && node.appendChild(container)} />);
          },
          (error) => {
            console.error('Mermaid rendering error:', error);
            const errorMessage = `Error rendering diagram: ${error.message}`;
            setMermaidError(errorMessage);
            container.innerHTML = `<div class="error" style="color: ${theme.palette.error.main}; padding: 1rem;">${errorMessage}</div>`;
            resolve(<div ref={(node) => node && node.appendChild(container)} />);
          }
        );
      });
    } catch (error) {
      console.error('Mermaid rendering error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setMermaidError(`Error rendering diagram: ${errorMessage}`);
      return <ErrorMessage error={errorMessage} />;
    }
  }, [theme.palette.mode, theme.palette.error.main]);

  const renderMath = React.useCallback((math: string, inline: boolean = false) => {
    try {
      return inline ? `$${math}$` : `$$${math}$$`;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setKatexError(`Error rendering math: ${errorMessage}`);
      return <ErrorMessage error={errorMessage} />;
    }
  }, []);

  return (
    <Paper 
      elevation={0} 
      className={`markdown-preview ${className || ''}`}
      sx={{
        p: 2,
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'background.default',
        color: 'text.primary',
        '& img': {
          maxWidth: '100%',
          height: 'auto'
        }
      }}
    >
      <Box
        className="markdown-preview"
        sx={{
          '& .markdown-body': {
            color: theme.palette.text.primary,
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: theme.palette.text.primary,
              borderBottom: `1px solid ${theme.palette.divider}`,
              marginBottom: '16px',
              fontWeight: 600,
            },
            '& a': {
              color: theme.palette.primary.main,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            '& code': {
              backgroundColor:
                theme.palette.mode === 'dark' ? '#292524' : '#d6d3d1',
              color: theme.palette.text.primary,
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '85%',
            },
            '& pre': {
              backgroundColor:
                theme.palette.mode === 'dark' ? '#292524' : '#d6d3d1',
              padding: '16px',
              overflow: 'auto',
              borderRadius: '3px',
              '& code': {
                backgroundColor: 'transparent',
                padding: 0,
              },
            },
            '& blockquote': {
              borderLeft: `4px solid ${
                theme.palette.mode === 'dark' ? '#44403c' : '#78716c'
              }`,
              color: theme.palette.text.secondary,
              padding: '0 16px',
              margin: '0',
            },
            '& table': {
              borderCollapse: 'collapse',
              width: '100%',
              '& th, & td': {
                border: `1px solid ${theme.palette.divider}`,
                padding: '6px 13px',
              },
              '& th': {
                backgroundColor:
                  theme.palette.mode === 'dark' ? '#292524' : '#d6d3d1',
                fontWeight: 600,
              },
              '& tr:nth-of-type(even)': {
                backgroundColor:
                  theme.palette.mode === 'dark'
                    ? '#1c191780'
                    : '#d6d3d120',
              },
            },
            '& hr': {
              border: 'none',
              borderBottom: `1px solid ${theme.palette.divider}`,
              margin: '24px 0',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
            },
            '& ul, & ol': {
              paddingLeft: '2em',
            },
            '& .task-list-item': {
              listStyle: 'none',
              '& input': {
                marginRight: '0.5em',
              },
            },
            '& .mermaid': {
              textAlign: 'center',
              margin: '1em 0',
              '& svg': {
                maxWidth: '100%',
              },
            },
          },
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkMath, remarkGfm, remarkToc]}
          rehypePlugins={[rehypeKatex]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';
              const value = String(children).replace(/\n$/, '');

              if (language === 'mermaid') {
                const [diagram, setDiagram] = React.useState<React.ReactNode>(null);
                
                React.useEffect(() => {
                  renderMermaidDiagram(value).then(setDiagram);
                }, [value]);
                
                return diagram || <div>Loading diagram...</div>;
              }

              return !inline ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={language}
                  PreTag="div"
                  {...props}
                >
                  {value}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {markdown}
        </ReactMarkdown>
        {mermaidError && <ErrorMessage error={mermaidError} />}
        {katexError && <ErrorMessage error={katexError} />}
      </Box>
    </Paper>
  );
};
