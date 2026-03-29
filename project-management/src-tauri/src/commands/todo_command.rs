use crate::models::todo_model::Todo;
use crate::services::todo_service::TodoService;
use crate::services::db_service::DbState;
use tauri::State;

#[tauri::command]
pub fn get_todos(state: State<DbState>, project_path: String) -> Result<Vec<Todo>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    TodoService::get_todos(&conn, &project_path)
}

#[tauri::command]
pub fn add_todo(state: State<DbState>, project_path: String, task: String) -> Result<Todo, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    TodoService::add_todo(&conn, &project_path, &task)
}

#[tauri::command]
pub fn toggle_todo(state: State<DbState>, id: i32, is_completed: bool) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    TodoService::toggle_todo(&conn, id, is_completed)
}

#[tauri::command]
pub fn update_todo_order(state: State<DbState>, id: i32, new_order: i32) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    TodoService::update_todo_order(&conn, id, new_order)
}

#[tauri::command]
pub fn delete_todo(state: State<DbState>, id: i32) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    TodoService::delete_todo(&conn, id)
}
