import React, { useState } from 'react'
import {
  Box,
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  TextField,
  Typography,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
} from '@mui/icons-material'
import { useProject } from '../contexts/ProjectContext'

interface TaskManagerProps {
  noteId: string
}

export const TaskManager: React.FC<TaskManagerProps> = ({ noteId }) => {
  const { notes, createTask, updateTask, deleteTask } = useProject()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const note = notes.find(n => n.id === noteId)
  if (!note) return null

  const handleCreateTask = () => {
    if (newTaskTitle.trim()) {
      createTask(noteId, newTaskTitle, selectedDate || undefined)
      setNewTaskTitle('')
      setSelectedDate(null)
    }
  }

  const handleToggleTask = (taskId: string, completed: boolean) => {
    updateTask(taskId, { completed })
  }

  return (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Tâches
      </Typography>

      <List>
        {note.tasks.map(task => (
          <ListItem
            key={task.id}
            dense
            sx={{
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={task.completed}
                onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                data-testid={`task-checkbox-${task.id}`}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            </ListItemIcon>
            <ListItemText
              primary={task.title}
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'text.secondary' : 'text.primary',
              }}
              secondary={
                task.dueDate && (
                  <Box
                    component="span"
                    data-testid={`task-date-${task.id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      color: 'text.secondary',
                      fontSize: '0.75rem',
                    }}
                  >
                    <EventIcon fontSize="small" />
                    {new Date(task.dueDate).toLocaleDateString('fr-FR')}
                  </Box>
                )
              }
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                size="small"
                onClick={() => deleteTask(task.id)}
                data-testid={`delete-task-${task.id}`}
                sx={{
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  '.MuiListItem-root:hover &': {
                    opacity: 1,
                  },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        <TextField
          size="small"
          fullWidth
          placeholder="Nouvelle tâche"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleCreateTask()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: 'background.paper',
            },
          }}
        />
        <DatePicker
          value={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          slotProps={{
            textField: {
              size: 'small',
              sx: {
                width: '150px',
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                },
              },
            },
          }}
        />
        <IconButton
          onClick={handleCreateTask}
          disabled={!newTaskTitle.trim()}
          data-testid="add-task-button"
          sx={{
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  )
}
