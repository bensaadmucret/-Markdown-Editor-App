#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod db;
mod commands;

use std::path::PathBuf;
use tauri::api::path::app_data_dir;
use db::DbState;
use commands::*;

fn main() {
    let context = tauri::generate_context!();
    let app_data_dir = app_data_dir(&context.config())
        .expect("Failed to get app data directory");
    let db_state = DbState::new(app_data_dir)
        .expect("Failed to initialize database");

    tauri::Builder::default()
        .manage(db_state)
        .invoke_handler(tauri::generate_handler![
            create_workspace,
            get_workspaces,
            save_workspace_settings,
            create_custom_theme,
            create_tab,
            get_workspace_tabs,
            create_backup,
            update_tab_active_state,
            delete_tab,
        ])
        .run(context)
        .expect("error while running tauri application");
}
