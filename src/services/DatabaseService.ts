import { invoke } from '@tauri-apps/api/tauri';
import { BaseDirectory, createDir } from '@tauri-apps/api/fs';
import { appDataDir } from '@tauri-apps/api/path';

export interface DBNote {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  project_id: string;
  is_pinned: boolean;
}

export interface DBProject {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface DBTag {
  id: string;
  name: string;
  created_at: string;
}

export interface DBTask {
  id: string;
  content: string;
  completed: boolean;
  note_id: string;
  created_at: string;
  updated_at: string;
}

export interface DBNoteTag {
  note_id: string;
  tag_id: string;
}

class DatabaseService {
  private dbPath: string = '';
  private initialized: boolean = false;
  private isTauri: boolean;

  constructor() {
    this.isTauri = typeof window !== 'undefined' && window.__TAURI__;
  }

  private async initializePath() {
    if (!this.isTauri) {
      console.warn('Not running in Tauri environment, using localStorage fallback');
      return;
    }

    try {
      const appDataPath = await appDataDir();
      await createDir('database', { dir: BaseDirectory.AppData, recursive: true });
      this.dbPath = `${appDataPath}database/notes.db`;
      console.log('Database path:', this.dbPath);
    } catch (error) {
      console.error('Error initializing database path:', error);
      throw error;
    }
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      await this.initializePath();
      
      if (this.isTauri) {
        await invoke('init_database', { dbPath: this.dbPath });
        console.log('Tauri database initialized successfully');
      } else {
        console.log('Using localStorage database');
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  // Notes
  async createNote(note: Omit<DBNote, 'created_at' | 'updated_at'>): Promise<DBNote> {
    return await invoke('create_note', { note });
  }

  async getNotes(projectId: string): Promise<DBNote[]> {
    return await invoke('get_notes', { projectId });
  }

  async updateNote(note: Partial<DBNote> & { id: string }): Promise<DBNote> {
    return await invoke('update_note', { note });
  }

  async deleteNote(id: string): Promise<void> {
    await invoke('delete_note', { id });
  }

  // Projects
  async createProject(project: Omit<DBProject, 'created_at' | 'updated_at'>): Promise<DBProject> {
    return await invoke('create_project', { project });
  }

  async getProjects(): Promise<DBProject[]> {
    return await invoke('get_projects');
  }

  async updateProject(project: Partial<DBProject> & { id: string }): Promise<DBProject> {
    return await invoke('update_project', { project });
  }

  async deleteProject(id: string): Promise<void> {
    await invoke('delete_project', { id });
  }

  // Tags
  async createTag(tag: Omit<DBTag, 'created_at'>): Promise<DBTag> {
    return await invoke('create_tag', { tag });
  }

  async getTags(): Promise<DBTag[]> {
    return await invoke('get_tags');
  }

  async deleteTag(id: string): Promise<void> {
    await invoke('delete_tag', { id });
  }

  // Tasks
  async createTask(task: Omit<DBTask, 'created_at' | 'updated_at'>): Promise<DBTask> {
    return await invoke('create_task', { task });
  }

  async getTasks(noteId: string): Promise<DBTask[]> {
    return await invoke('get_tasks', { noteId });
  }

  async updateTask(task: Partial<DBTask> & { id: string }): Promise<DBTask> {
    return await invoke('update_task', { task });
  }

  async deleteTask(id: string): Promise<void> {
    await invoke('delete_task', { id });
  }

  // Note Tags
  async addTagToNote(noteId: string, tagId: string): Promise<void> {
    await invoke('add_tag_to_note', { noteId, tagId });
  }

  async removeTagFromNote(noteId: string, tagId: string): Promise<void> {
    await invoke('remove_tag_from_note', { noteId, tagId });
  }

  async getNoteTags(noteId: string): Promise<DBTag[]> {
    return await invoke('get_note_tags', { noteId });
  }
}

export const databaseService = new DatabaseService();
