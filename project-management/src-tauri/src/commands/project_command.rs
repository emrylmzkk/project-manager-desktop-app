use crate::models::git_model::GitDetails;
use crate::models::project_model::{FileNode, Project};
use crate::services::git_service::GitService;
use crate::services::project_service::ProjectService;

#[tauri::command]
pub fn scan_directory(base_path: String) -> Vec<Project> {
    ProjectService::scan_directory(&base_path)
}

#[tauri::command]
pub fn get_git_details(path: String) -> Result<GitDetails, String> {
    GitService::get_git_details(&path)
}

#[tauri::command]
pub fn get_file_tree(path: String) -> Vec<FileNode> {
    ProjectService::get_file_tree(&path, 3)
}

#[tauri::command]
pub fn get_project_info(path: String) -> Option<Project> {
    ProjectService::get_project_info(&path)
}

#[tauri::command]
pub fn open_in_ide(path: String, ide: String) -> Result<(), String> {
    ProjectService::open_in_ide(&path, &ide)
}

#[tauri::command]
pub fn open_in_file_explorer(path: String) -> Result<(), String> {
    ProjectService::open_in_file_explorer(&path)
}

#[tauri::command]
pub fn git_add(path: String) -> Result<(), String> {
    GitService::git_add(&path)
}

#[tauri::command]
pub fn git_commit(path: String, message: String) -> Result<(), String> {
    GitService::git_commit(&path, &message)
}

#[tauri::command]
pub fn git_push(path: String) -> Result<(), String> {
    GitService::git_push(&path)
}

#[tauri::command]
pub fn git_checkout(path: String, branch_name: String) -> Result<(), String> {
    GitService::git_checkout(&path, &branch_name)
}

#[tauri::command]
pub fn git_stash(path: String) -> Result<(), String> {
    GitService::git_stash(&path)
}

#[tauri::command]
pub fn git_init(path: String) -> Result<(), String> {
    GitService::git_init(&path)
}

#[tauri::command]
pub fn git_remote_add(path: String, url: String) -> Result<(), String> {
    GitService::git_remote_add(&path, &url)
}

#[tauri::command]
pub fn git_push_initial(path: String) -> Result<(), String> {
    GitService::git_push_initial(&path)
}

#[tauri::command]
pub fn git_status(path: String) -> Result<String, String> {
    GitService::git_status(&path)
}

#[tauri::command]
pub fn get_projects_from_paths(paths: Vec<String>) -> Vec<Project> {
    ProjectService::get_projects_from_paths(paths)
}

#[tauri::command]
pub fn git_pull(path: String) -> Result<String, String> {
    GitService::git_pull(&path)
}

#[tauri::command]
pub fn git_fetch(path: String) -> Result<String, String> {
    GitService::git_fetch(&path)
}

#[tauri::command]
pub fn git_clone(target_path: String, url: String) -> Result<String, String> {
    GitService::git_clone(&target_path, &url)
}
