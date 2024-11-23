import React, { createContext, useContext, useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { databaseService } from '../services/DatabaseService';
import type { DBNote, DBProject, DBTag, DBTask } from '../services/DatabaseService';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: Date;
  noteId: string;
}

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  projectId: string;
  tags: string[];
  tasks: Task[];
}

interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectContextType {
  projects: Project[];
  currentProject: Project | null;
  notes: Note[];
  currentNote: Note | null;
  tags: Tag[];
  createProject: (name: string) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  setCurrentProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  createNote: (projectId: string, title: string) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  updateNote: (noteId: string, content: string) => Promise<void>;
  updateNoteTitle: (noteId: string, title: string) => Promise<void>;
  setCurrentNote: (noteId: string) => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag>;
  addTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  createTask: (noteId: string, title: string, dueDate?: Date) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  searchNotes: (query: string) => Promise<Note[]>;
  exportNoteToPDF: (noteId: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);

  // Initialisation de la base de données
  useEffect(() => {
    const initDB = async () => {
      try {
        await databaseService.initialize();
        await loadInitialData();
      } catch (error) {
        console.error('Error initializing database:', error);
      }
    };
    initDB();
  }, []);

  const loadInitialData = async () => {
    try {
      // Charger les projets
      const dbProjects = await databaseService.getAllProjects();
      const projects = dbProjects.map(p => ({
        ...p,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
      setProjects(projects);

      // Charger les notes
      const dbNotes = await databaseService.getAllNotes();
      const notesWithDetails = await Promise.all(
        dbNotes.map(async n => {
          const tags = await databaseService.getNoteTags(n.id);
          const tasks = await databaseService.getNoteTasks(n.id);
          return {
            id: n.id,
            title: n.title,
            content: n.content,
            projectId: n.project_id,
            tags: tags.map(t => t.id),
            tasks: tasks.map(t => ({
              ...t,
              dueDate: t.due_date ? new Date(t.due_date) : undefined,
              noteId: t.note_id
            }))
          };
        })
      );
      setNotes(notesWithDetails);

      // Charger les tags
      const dbTags = await databaseService.getAllTags();
      setTags(dbTags);

    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const handleCreateProject = async (name: string) => {
    const newProject: DBProject = {
      id: Date.now().toString(),
      name,
      description: '',
      color: '#458588',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await databaseService.createProject(newProject);
    await loadInitialData();
  };

  const handleDeleteProject = async (projectId: string) => {
    await databaseService.deleteProject(projectId);
    await loadInitialData();
  };

  const handleSetCurrentProject = async (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const updatedProject: DBProject = {
      ...project,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await databaseService.updateProject(updatedProject);
    await loadInitialData();
  };

  const handleCreateNote = async (projectId: string, title: string) => {
    const newNote: DBNote = {
      id: Date.now().toString(),
      title,
      content: '',
      project_id: projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await databaseService.createNote(newNote);
    await loadInitialData();
  };

  const handleDeleteNote = async (noteId: string) => {
    await databaseService.deleteNote(noteId);
    await loadInitialData();
  };

  const handleUpdateNote = async (noteId: string, content: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const updatedNote: DBNote = {
      id: noteId,
      title: note.title,
      content,
      project_id: note.projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await databaseService.updateNote(updatedNote);
    await loadInitialData();
  };

  const handleUpdateNoteTitle = async (noteId: string, title: string) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    const updatedNote: DBNote = {
      id: noteId,
      title,
      content: note.content,
      project_id: note.projectId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await databaseService.updateNote(updatedNote);
    await loadInitialData();
  };

  const handleSetCurrentNote = async (noteId: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      setCurrentNote(note);
    }
  };

  const handleCreateTag = async (name: string, color: string) => {
    const newTag: DBTag = {
      id: Date.now().toString(),
      name,
      color
    };

    await databaseService.createTag(newTag);
    await loadInitialData();
    return newTag;
  };

  const handleAddTagToNote = async (noteId: string, tagId: string) => {
    await databaseService.addTagToNote(noteId, tagId);
    await loadInitialData();
  };

  const handleRemoveTagFromNote = async (noteId: string, tagId: string) => {
    await databaseService.removeTagFromNote(noteId, tagId);
    await loadInitialData();
  };

  const handleCreateTask = async (noteId: string, title: string, dueDate?: Date) => {
    const newTask: DBTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      due_date: dueDate?.toISOString(),
      note_id: noteId
    };

    await databaseService.createTask(newTask);
    await loadInitialData();
  };

  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    const note = notes.find(n => n.tasks.some(t => t.id === taskId));
    if (!note) return;

    const task = note.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask: DBTask = {
      id: taskId,
      title: updates.title || task.title,
      completed: updates.completed ?? task.completed,
      due_date: updates.dueDate?.toISOString(),
      note_id: task.noteId
    };

    await databaseService.updateTask(updatedTask);
    await loadInitialData();
  };

  const handleDeleteTask = async (taskId: string) => {
    await databaseService.deleteTask(taskId);
    await loadInitialData();
  };

  const handleSearchNotes = async (query: string) => {
    const searchResults = await databaseService.searchNotes(query);
    return Promise.all(
      searchResults.map(async n => {
        const tags = await databaseService.getNoteTags(n.id);
        const tasks = await databaseService.getNoteTasks(n.id);
        return {
          id: n.id,
          title: n.title,
          content: n.content,
          projectId: n.project_id,
          tags: tags.map(t => t.id),
          tasks: tasks.map(t => ({
            ...t,
            dueDate: t.due_date ? new Date(t.due_date) : undefined,
            noteId: t.note_id
          }))
        };
      })
    );
  };

  const handleExportNoteToPDF = async (noteId: string) => {
    console.log('handleExportNoteToPDF called with noteId:', noteId);
    
    const note = notes.find(n => n.id === noteId);
    if (!note) {
      console.error('Note not found for id:', noteId);
      return;
    }
    console.log('Found note:', note);

    // Attendre que le contenu soit rendu
    await new Promise(resolve => setTimeout(resolve, 100));

    const previewElement = document.querySelector('.markdown-preview');
    if (!previewElement) {
      console.error('Preview element not found');
      return;
    }
    console.log('Found preview element:', previewElement);

    try {
      const padding = 40;
      const contentWidth = previewElement.scrollWidth;
      const contentHeight = previewElement.scrollHeight;
      const pdfWidth = contentWidth + (padding * 2);
      const pdfHeight = contentHeight + (padding * 2);
      console.log('PDF dimensions:', { contentWidth, contentHeight, pdfWidth, pdfHeight });

      console.log('Creating canvas...');
      const canvas = await html2canvas(previewElement as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        width: contentWidth,
        height: contentHeight,
        backgroundColor: '#ffffff'
      });
      console.log('Canvas created successfully');
      
      console.log('Creating PDF...');
      const pdf = new jsPDF({
        orientation: contentWidth > contentHeight ? 'landscape' : 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight]
      });

      console.log('Adding image to PDF...');
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        padding,
        padding,
        contentWidth,
        contentHeight
      );

      console.log('Saving PDF as:', `${note.title}.pdf`);
      pdf.save(`${note.title}.pdf`);
      console.log('PDF saved successfully');
    } catch (error) {
      console.error('Error during PDF export:', error);
    }
  };

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
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
