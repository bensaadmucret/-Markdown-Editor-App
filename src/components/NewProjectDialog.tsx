import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useProject } from '../contexts/ProjectContext'

interface NewProjectDialogProps {
  open: boolean
  onClose: () => void
}

export default function NewProjectDialog({ open, onClose }: NewProjectDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const { createProject } = useProject()

  const handleSubmit = () => {
    if (name.trim()) {
      createProject(name, description)
      onClose()
      setName('')
      setDescription('')
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Nouveau Projet</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du projet"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!name.trim()}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  )
}
