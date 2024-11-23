use crate::db::{DbState, Tab, Workspace, WorkspaceSettings, CustomTheme, Note, Project, Tag, Task};
use tauri::State;

#[tauri::command]
pub async fn create_workspace(
    workspace: Workspace,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.create_workspace(&workspace)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_workspaces(
    db: State<'_, DbState>,
) -> Result<Vec<Workspace>, String> {
    db.get_workspaces()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn save_workspace_settings(
    settings: WorkspaceSettings,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.save_workspace_settings(&settings)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_custom_theme(
    theme: CustomTheme,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.create_custom_theme(&theme)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_tab(
    tab: Tab,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.create_tab(&tab)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_workspace_tabs(
    workspace_id: String,
    db: State<'_, DbState>,
) -> Result<Vec<Tab>, String> {
    db.get_workspace_tabs(&workspace_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_backup(
    workspace_id: String,
    data: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.create_backup(&workspace_id, &data)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_tab_active_state(
    tab_id: String,
    is_active: bool,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.update_tab_active_state(&tab_id, is_active)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_tab(
    tab_id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.delete_tab(&tab_id)
        .map_err(|e| e.to_string())
}

// Notes
#[tauri::command]
pub async fn create_note(
    note: Note,
    db: State<'_, DbState>,
) -> Result<Note, String> {
    db.create_note(&note)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_notes(
    project_id: String,
    db: State<'_, DbState>,
) -> Result<Vec<Note>, String> {
    db.get_notes(&project_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_note(
    note: Note,
    db: State<'_, DbState>,
) -> Result<Note, String> {
    db.update_note(&note)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_note(
    id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.delete_note(&id)
        .map_err(|e| e.to_string())
}

// Projects
#[tauri::command]
pub async fn create_project(
    project: Project,
    db: State<'_, DbState>,
) -> Result<Project, String> {
    db.create_project(&project)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_projects(
    db: State<'_, DbState>,
) -> Result<Vec<Project>, String> {
    db.get_projects()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_project(
    project: Project,
    db: State<'_, DbState>,
) -> Result<Project, String> {
    db.update_project(&project)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_project(
    id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.delete_project(&id)
        .map_err(|e| e.to_string())
}

// Tags
#[tauri::command]
pub async fn create_tag(
    tag: Tag,
    db: State<'_, DbState>,
) -> Result<Tag, String> {
    db.create_tag(&tag)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_tags(
    db: State<'_, DbState>,
) -> Result<Vec<Tag>, String> {
    db.get_tags()
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_tag(
    id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.delete_tag(&id)
        .map_err(|e| e.to_string())
}

// Tasks
#[tauri::command]
pub async fn create_task(
    task: Task,
    db: State<'_, DbState>,
) -> Result<Task, String> {
    db.create_task(&task)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_tasks(
    note_id: String,
    db: State<'_, DbState>,
) -> Result<Vec<Task>, String> {
    db.get_tasks(&note_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_task(
    task: Task,
    db: State<'_, DbState>,
) -> Result<Task, String> {
    db.update_task(&task)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_task(
    id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.delete_task(&id)
        .map_err(|e| e.to_string())
}

// Note Tags
#[tauri::command]
pub async fn add_tag_to_note(
    note_id: String,
    tag_id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.add_tag_to_note(&note_id, &tag_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn remove_tag_from_note(
    note_id: String,
    tag_id: String,
    db: State<'_, DbState>,
) -> Result<(), String> {
    db.remove_tag_from_note(&note_id, &tag_id)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_note_tags(
    note_id: String,
    db: State<'_, DbState>,
) -> Result<Vec<Tag>, String> {
    db.get_note_tags(&note_id)
        .map_err(|e| e.to_string())
}
