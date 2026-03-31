// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
struct ProjectManager;

impl ProjectManager {
    fn get_welcome_message(name: &str) -> String {
        format!("Project Navigator Hoş geldin {}", name)
    }
}

//Controller bu sekilde belirtiliyor (front bunu cagiracak)
#[tauri::command]
fn greet_from_rust(name: &str) -> String {
    ProjectManager::get_welcome_message(name)
}

use project_management_lib::services::db_service::{DbService, DbState};
use std::sync::Mutex;
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let handle = app.handle();
            let conn = DbService::init(handle).expect("Failed to initialize database");
            app.manage(DbState(Mutex::new(conn)));
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            greet_from_rust,
            project_management_lib::commands::project_command::scan_directory,
            project_management_lib::commands::project_command::get_git_details,
            project_management_lib::commands::project_command::get_file_tree,
            project_management_lib::commands::project_command::get_project_info,
            project_management_lib::commands::project_command::open_in_ide,
            project_management_lib::commands::project_command::open_in_file_explorer,
            project_management_lib::commands::system_command::get_system_info,
            project_management_lib::commands::project_command::git_add,
            project_management_lib::commands::project_command::git_commit,
            project_management_lib::commands::project_command::git_push,
            project_management_lib::commands::project_command::git_checkout,
            project_management_lib::commands::project_command::git_stash,
            project_management_lib::commands::project_command::git_init,
            project_management_lib::commands::project_command::git_remote_add,
            project_management_lib::commands::project_command::git_push_initial,
            project_management_lib::commands::project_command::git_status,
            project_management_lib::commands::project_command::get_projects_from_paths,
            project_management_lib::commands::project_command::git_pull,
            project_management_lib::commands::project_command::git_fetch,
            project_management_lib::commands::project_command::git_clone,
            project_management_lib::commands::project_command::git_merge,
            project_management_lib::commands::project_command::get_conflicted_files,
            project_management_lib::commands::todo_command::get_todos,
            project_management_lib::commands::todo_command::add_todo,
            project_management_lib::commands::todo_command::toggle_todo,
            project_management_lib::commands::todo_command::update_todo_order,
            project_management_lib::commands::todo_command::delete_todo,
            project_management_lib::commands::note_command::get_project_notes,
            project_management_lib::commands::note_command::add_project_note,
            project_management_lib::commands::note_command::update_project_note,
            project_management_lib::commands::note_command::delete_project_note,
            project_management_lib::commands::project_template_command::create_project_from_template,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
