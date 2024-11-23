import React, { createContext, useContext, useState, useEffect } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface Task {
  id: string
  title: string
  completed: boolean
  dueDate?: Date
  noteId: string
}

interface Tag {
  id: string
  name: string
  color: string
}

interface Note {
  id: string
  title: string
  content: string
  projectId: string
  tags: string[]
  tasks: Task[]
}

interface Project {
  id: string
  name: string
  description: string
  color: string
  createdAt: Date
  updatedAt: Date
}

interface ProjectContextType {
  projects: Project[]
  currentProject: Project | null
  notes: Note[]
  currentNote: Note | null
  tags: Tag[]
  createProject: (name: string) => void
  deleteProject: (projectId: string) => void
  setCurrentProject: (projectId: string) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  createNote: (projectId: string, title: string) => void
  deleteNote: (noteId: string) => void
  updateNote: (noteId: string, content: string) => void
  updateNoteTitle: (noteId: string, title: string) => void
  setCurrentNote: (noteId: string) => void
  createTag: (name: string, color: string) => Tag
  addTagToNote: (noteId: string, tagId: string) => void
  removeTagFromNote: (noteId: string, tagId: string) => void
  createTask: (noteId: string, title: string, dueDate?: Date) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  searchNotes: (query: string) => Note[]
  exportNoteToPDF: (noteId: string) => Promise<void>
}

const PROJECT_COLORS = [
  '#458588', // Bleu
  '#98971a', // Vert
  '#d79921', // Jaune
  '#cc241d', // Rouge
  '#b16286', // Magenta
  '#689d6a', // Cyan
  '#a89984', // Gris
  '#d65d0e', // Orange
]

export const ProjectContext = createContext<ProjectContextType | null>(null)

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentProject, setCurrentProject] = useState<Project | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [tags, setTags] = useState<Tag[]>([])

  // Charger les données depuis le localStorage au démarrage
  useEffect(() => {
    const savedProjects = localStorage.getItem('projects')
    const savedNotes = localStorage.getItem('notes')
    const savedTags = localStorage.getItem('tags')
    const savedCurrentProjectId = localStorage.getItem('currentProjectId')
    const savedCurrentNoteId = localStorage.getItem('currentNoteId')

    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects)
      setProjects(parsedProjects.map((project: any) => ({
        ...project,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt)
      })))

      // Restaurer le projet courant
      if (savedCurrentProjectId) {
        const currentProject = parsedProjects.find((p: any) => p.id === savedCurrentProjectId)
        if (currentProject) {
          setCurrentProject({
            ...currentProject,
            createdAt: new Date(currentProject.createdAt),
            updatedAt: new Date(currentProject.updatedAt)
          })
        }
      }
    }

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      setNotes(parsedNotes)

      // Restaurer la note courante
      if (savedCurrentNoteId) {
        const currentNote = parsedNotes.find((n: any) => n.id === savedCurrentNoteId)
        if (currentNote) {
          setCurrentNote(currentNote)
        }
      }
    }

    if (savedTags) {
      setTags(JSON.parse(savedTags))
    }
  }, [])

  // Sauvegarder les données dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects))
  }, [projects])

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem('tags', JSON.stringify(tags))
  }, [tags])

  // Sauvegarder currentProject et currentNote dans le localStorage
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('currentProjectId', currentProject.id)
    } else {
      localStorage.removeItem('currentProjectId')
    }
  }, [currentProject])

  useEffect(() => {
    if (currentNote) {
      localStorage.setItem('currentNoteId', currentNote.id)
    } else {
      localStorage.removeItem('currentNoteId')
    }
  }, [currentNote])

  const handleCreateProject = (name: string) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description: '',
      color: PROJECT_COLORS[projects.length % PROJECT_COLORS.length],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setProjects(prev => [...prev, newProject])
    return newProject
  }

  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    setProjects(prev =>
      prev.map(project =>
        project.id === projectId
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
      )
    )
  }

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(p => p.id !== projectId))
    setNotes(prev => prev.filter(n => n.projectId !== projectId))
    if (currentProject?.id === projectId) {
      setCurrentProject(null)
      setCurrentNote(null)
    }
  }

  const handleSetCurrentProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId)
    setCurrentProject(project || null)
    setCurrentNote(null)
  }

  const handleCreateNote = (projectId: string, title: string) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content: '',
      projectId,
      tags: [],
      tasks: [],
    }
    setNotes(prev => [...prev, newNote])
    return newNote
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId))
    if (currentNote?.id === noteId) {
      setCurrentNote(null)
    }
  }

  const handleUpdateNote = (noteId: string, content: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, content }
          : note
      )
    )
    setCurrentNote(prev => 
      prev?.id === noteId 
        ? { ...prev, content }
        : prev
    )
  }

  const handleUpdateNoteTitle = (noteId: string, title: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, title }
          : note
      )
    )
  }

  const handleSetCurrentNote = (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    setCurrentNote(note || null)
  }

  const handleCreateTag = (name: string, color: string) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name,
      color,
    }
    setTags(prev => [...prev, newTag])
    return newTag
  }

  const handleAddTagToNote = (noteId: string, tagId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId && !note.tags.includes(tagId)
          ? { ...note, tags: [...note.tags, tagId] }
          : note
      )
    )
  }

  const handleRemoveTagFromNote = (noteId: string, tagId: string) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, tags: note.tags.filter(id => id !== tagId) }
          : note
      )
    )
  }

  const handleCreateTask = (noteId: string, title: string, dueDate?: Date) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      completed: false,
      dueDate,
      noteId,
    }
    setNotes(prev =>
      prev.map(note =>
        note.id === noteId
          ? { ...note, tasks: [...note.tasks, newTask] }
          : note
      )
    )
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setNotes(prev =>
      prev.map(note => ({
        ...note,
        tasks: note.tasks.map(task =>
          task.id === taskId
            ? { ...task, ...updates }
            : task
        ),
      }))
    )
  }

  const handleDeleteTask = (taskId: string) => {
    setNotes(prev =>
      prev.map(note => ({
        ...note,
        tasks: note.tasks.filter(task => task.id !== taskId),
      }))
    )
  }

  const handleSearchNotes = (query: string) => {
    if (!query.trim()) return []
    
    const searchTerms = query.toLowerCase().split(' ')
    return notes.filter(note => {
      const noteText = `${note.title} ${note.content}`.toLowerCase()
      return searchTerms.every(term => noteText.includes(term))
    })
  }

  const handleExportNoteToPDF = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId)
    if (!note) return

    const element = document.querySelector('.w-md-editor-preview')
    if (!element) return

    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`${note.title}.pdf`)
  }

  const value = {
    projects,
    currentProject,
    notes,
    currentNote,
    tags,
    createProject: handleCreateProject,
    deleteProject: handleDeleteProject,
    setCurrentProject: handleSetCurrentProject,
    updateProject: handleUpdateProject,
    createNote: handleCreateNote,
    deleteNote: handleDeleteNote,
    updateNote: handleUpdateNote,
    updateNoteTitle: handleUpdateNoteTitle,
    setCurrentNote: handleSetCurrentNote,
    createTag: handleCreateTag,
    addTagToNote: handleAddTagToNote,
    removeTagFromNote: handleRemoveTagFromNote,
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    searchNotes: handleSearchNotes,
    exportNoteToPDF: handleExportNoteToPDF,
  }

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProject = () => {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }
  return context
}
