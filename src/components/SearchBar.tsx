import React, { useState, useEffect } from 'react'
import {
  TextField,
  IconButton,
  Box,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@mui/material'
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material'
import { useProject } from '../contexts/ProjectContext'

export const SearchBar: React.FC = () => {
  const { searchNotes, setCurrentNote } = useProject()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<ReturnType<typeof searchNotes>>([])
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(searchNotes(searchQuery))
    } else {
      setSearchResults([])
    }
  }, [searchQuery, searchNotes])

  const handleClear = () => {
    setSearchQuery('')
    setSearchResults([])
  }

  return (
    <Box ref={setAnchorEl}>
      <TextField
        fullWidth
        placeholder="Rechercher dans les notes..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          endAdornment: searchQuery && (
            <IconButton size="small" onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          ),
        }}
      />

      <Popover
        open={searchResults.length > 0}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setSearchResults([])}
        PaperProps={{
          sx: { width: anchorEl?.clientWidth },
        }}
      >
        <List>
          {searchResults.map(note => (
            <ListItem
              key={note.id}
              button
              onClick={() => {
                setCurrentNote(note)
                setSearchResults([])
                setSearchQuery('')
              }}
            >
              <ListItemText
                primary={note.title}
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {note.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  )
}
