use rusqlite::{Connection, Result};
use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::sync::Mutex;
use std::fs;
use chrono::Utc;

#[derive(Debug, Serialize, Deserialize)]
pub struct Workspace {
    pub id: String,
    pub name: String,
    pub type_: String,
    pub theme_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WorkspaceSettings {
    pub workspace_id: String,
    pub dark_mode: bool,
    pub split_view: bool,
    pub privacy_level: String,
    pub auto_save: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CustomTheme {
    pub id: String,
    pub name: String,
    pub type_: String,
    pub primary_color: String,
    pub secondary_color: String,
    pub background_color: String,
    pub surface_color: String,
    pub text_color: String,
    pub accent_color: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Tab {
    pub id: String,
    pub workspace_id: String,
    pub title: String,
    pub content: Option<String>,
    pub type_: String,
    pub position: i32,
    pub is_active: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Note {
    pub id: String,
    pub title: String,
    pub content: String,
    pub project_id: String,
    pub created_at: String,
    pub updated_at: String,
    pub is_pinned: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Project {
    pub id: String,
    pub name: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Tag {
    pub id: String,
    pub name: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub content: String,
    pub completed: bool,
    pub note_id: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NoteTag {
    pub note_id: String,
    pub tag_id: String,
}

pub struct DbState {
    pub connection: Mutex<Connection>,
}

impl DbState {
    pub fn new(app_dir: PathBuf) -> Result<Self> {
        fs::create_dir_all(&app_dir)?;
        let db_path = app_dir.join("app.db");
        let conn = Connection::open(db_path)?;
        
        // Initialize database with schema
        let init_sql = include_str!("../migrations/init.sql");
        conn.execute_batch(init_sql)?;
        
        Ok(DbState {
            connection: Mutex::new(conn),
        })
    }

    // Workspaces
    pub fn create_workspace(&self, workspace: &Workspace) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT INTO workspaces (id, name, type, theme_id) VALUES (?1, ?2, ?3, ?4)",
            (&workspace.id, &workspace.name, &workspace.type_, &workspace.theme_id),
        )?;
        Ok(())
    }

    pub fn get_workspaces(&self) -> Result<Vec<Workspace>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, type, theme_id FROM workspaces")?;
        let workspace_iter = stmt.query_map([], |row| {
            Ok(Workspace {
                id: row.get(0)?,
                name: row.get(1)?,
                type_: row.get(2)?,
                theme_id: row.get(3)?,
            })
        })?;

        let mut workspaces = Vec::new();
        for workspace in workspace_iter {
            workspaces.push(workspace?);
        }
        Ok(workspaces)
    }

    // Workspace Settings
    pub fn save_workspace_settings(&self, settings: &WorkspaceSettings) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT OR REPLACE INTO workspace_settings 
            (workspace_id, dark_mode, split_view, privacy_level, auto_save) 
            VALUES (?1, ?2, ?3, ?4, ?5)",
            (
                &settings.workspace_id,
                &settings.dark_mode,
                &settings.split_view,
                &settings.privacy_level,
                &settings.auto_save,
            ),
        )?;
        Ok(())
    }

    // Custom Themes
    pub fn create_custom_theme(&self, theme: &CustomTheme) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT INTO custom_themes 
            (id, name, type, primary_color, secondary_color, background_color, 
            surface_color, text_color, accent_color) 
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            (
                &theme.id,
                &theme.name,
                &theme.type_,
                &theme.primary_color,
                &theme.secondary_color,
                &theme.background_color,
                &theme.surface_color,
                &theme.text_color,
                &theme.accent_color,
            ),
        )?;
        Ok(())
    }

    // Tabs
    pub fn create_tab(&self, tab: &Tab) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT INTO tabs 
            (id, workspace_id, title, content, type, position, is_active) 
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            (
                &tab.id,
                &tab.workspace_id,
                &tab.title,
                &tab.content,
                &tab.type_,
                &tab.position,
                &tab.is_active,
            ),
        )?;
        Ok(())
    }

    pub fn get_workspace_tabs(&self, workspace_id: &str) -> Result<Vec<Tab>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, workspace_id, title, content, type, position, is_active 
            FROM tabs WHERE workspace_id = ? ORDER BY position"
        )?;
        
        let tab_iter = stmt.query_map([workspace_id], |row| {
            Ok(Tab {
                id: row.get(0)?,
                workspace_id: row.get(1)?,
                title: row.get(2)?,
                content: row.get(3)?,
                type_: row.get(4)?,
                position: row.get(5)?,
                is_active: row.get(6)?,
            })
        })?;

        let mut tabs = Vec::new();
        for tab in tab_iter {
            tabs.push(tab?);
        }
        Ok(tabs)
    }

    // Backup
    pub fn create_backup(&self, workspace_id: &str, data: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT INTO backups (id, workspace_id, data) VALUES (?1, ?2, ?3)",
            (&uuid::Uuid::new_v4().to_string(), workspace_id, data),
        )?;
        Ok(())
    }

    // Notes
    pub fn create_note(&self, note: &Note) -> Result<Note> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut note = note.clone();
        note.created_at = now.clone();
        note.updated_at = now;

        conn.execute(
            "INSERT INTO notes (id, title, content, project_id, created_at, updated_at, is_pinned) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)",
            (
                &note.id,
                &note.title,
                &note.content,
                &note.project_id,
                &note.created_at,
                &note.updated_at,
                &note.is_pinned,
            ),
        )?;

        Ok(note)
    }

    pub fn get_notes(&self, project_id: &str) -> Result<Vec<Note>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, title, content, project_id, created_at, updated_at, is_pinned 
             FROM notes WHERE project_id = ?"
        )?;
        
        let notes = stmt.query_map([project_id], |row| {
            Ok(Note {
                id: row.get(0)?,
                title: row.get(1)?,
                content: row.get(2)?,
                project_id: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
                is_pinned: row.get(6)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;

        Ok(notes)
    }

    pub fn update_note(&self, note: &Note) -> Result<Note> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut updated_note = note.clone();
        updated_note.updated_at = now;

        conn.execute(
            "UPDATE notes SET title = ?1, content = ?2, is_pinned = ?3, updated_at = ?4 
             WHERE id = ?5",
            (
                &updated_note.title,
                &updated_note.content,
                &updated_note.is_pinned,
                &updated_note.updated_at,
                &updated_note.id,
            ),
        )?;

        Ok(updated_note)
    }

    pub fn delete_note(&self, id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute("DELETE FROM notes WHERE id = ?", [id])?;
        Ok(())
    }

    // Projects
    pub fn create_project(&self, project: &Project) -> Result<Project> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut project = project.clone();
        project.created_at = now.clone();
        project.updated_at = now;

        conn.execute(
            "INSERT INTO projects (id, name, created_at, updated_at) 
             VALUES (?1, ?2, ?3, ?4)",
            (
                &project.id,
                &project.name,
                &project.created_at,
                &project.updated_at,
            ),
        )?;

        Ok(project)
    }

    pub fn get_projects(&self) -> Result<Vec<Project>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, created_at, updated_at FROM projects")?;
        
        let projects = stmt.query_map([], |row| {
            Ok(Project {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
                updated_at: row.get(3)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;

        Ok(projects)
    }

    pub fn update_project(&self, project: &Project) -> Result<Project> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut updated_project = project.clone();
        updated_project.updated_at = now;

        conn.execute(
            "UPDATE projects SET name = ?1, updated_at = ?2 WHERE id = ?3",
            (
                &updated_project.name,
                &updated_project.updated_at,
                &updated_project.id,
            ),
        )?;

        Ok(updated_project)
    }

    pub fn delete_project(&self, id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute("DELETE FROM projects WHERE id = ?", [id])?;
        Ok(())
    }

    // Tags
    pub fn create_tag(&self, tag: &Tag) -> Result<Tag> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut tag = tag.clone();
        tag.created_at = now;

        conn.execute(
            "INSERT INTO tags (id, name, created_at) VALUES (?1, ?2, ?3)",
            (&tag.id, &tag.name, &tag.created_at),
        )?;

        Ok(tag)
    }

    pub fn get_tags(&self) -> Result<Vec<Tag>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare("SELECT id, name, created_at FROM tags")?;
        
        let tags = stmt.query_map([], |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;

        Ok(tags)
    }

    pub fn delete_tag(&self, id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute("DELETE FROM tags WHERE id = ?", [id])?;
        Ok(())
    }

    // Tasks
    pub fn create_task(&self, task: &Task) -> Result<Task> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut task = task.clone();
        task.created_at = now.clone();
        task.updated_at = now;

        conn.execute(
            "INSERT INTO tasks (id, content, completed, note_id, created_at, updated_at) 
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            (
                &task.id,
                &task.content,
                &task.completed,
                &task.note_id,
                &task.created_at,
                &task.updated_at,
            ),
        )?;

        Ok(task)
    }

    pub fn get_tasks(&self, note_id: &str) -> Result<Vec<Task>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT id, content, completed, note_id, created_at, updated_at 
             FROM tasks WHERE note_id = ?"
        )?;
        
        let tasks = stmt.query_map([note_id], |row| {
            Ok(Task {
                id: row.get(0)?,
                content: row.get(1)?,
                completed: row.get(2)?,
                note_id: row.get(3)?,
                created_at: row.get(4)?,
                updated_at: row.get(5)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;

        Ok(tasks)
    }

    pub fn update_task(&self, task: &Task) -> Result<Task> {
        let conn = self.connection.lock().unwrap();
        let now = Utc::now().to_rfc3339();
        
        let mut updated_task = task.clone();
        updated_task.updated_at = now;

        conn.execute(
            "UPDATE tasks SET content = ?1, completed = ?2, updated_at = ?3 WHERE id = ?4",
            (
                &updated_task.content,
                &updated_task.completed,
                &updated_task.updated_at,
                &updated_task.id,
            ),
        )?;

        Ok(updated_task)
    }

    pub fn delete_task(&self, id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute("DELETE FROM tasks WHERE id = ?", [id])?;
        Ok(())
    }

    // Note Tags
    pub fn add_tag_to_note(&self, note_id: &str, tag_id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "INSERT INTO note_tags (note_id, tag_id) VALUES (?1, ?2)",
            (note_id, tag_id),
        )?;
        Ok(())
    }

    pub fn remove_tag_from_note(&self, note_id: &str, tag_id: &str) -> Result<()> {
        let conn = self.connection.lock().unwrap();
        conn.execute(
            "DELETE FROM note_tags WHERE note_id = ?1 AND tag_id = ?2",
            (note_id, tag_id),
        )?;
        Ok(())
    }

    pub fn get_note_tags(&self, note_id: &str) -> Result<Vec<Tag>> {
        let conn = self.connection.lock().unwrap();
        let mut stmt = conn.prepare(
            "SELECT t.id, t.name, t.created_at 
             FROM tags t 
             INNER JOIN note_tags nt ON t.id = nt.tag_id 
             WHERE nt.note_id = ?"
        )?;
        
        let tags = stmt.query_map([note_id], |row| {
            Ok(Tag {
                id: row.get(0)?,
                name: row.get(1)?,
                created_at: row.get(2)?,
            })
        })?
        .collect::<Result<Vec<_>>>()?;

        Ok(tags)
    }
}
