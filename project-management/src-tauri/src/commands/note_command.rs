use crate::models::note_model::Note;
use crate::services::note_service::NoteService;
use crate::services::db_service::DbState;
use tauri::State;

#[tauri::command]
pub fn get_project_notes(state: State<DbState>, project_path: String) -> Result<Vec<Note>, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    NoteService::get_notes(&conn, &project_path)
}

#[tauri::command]
pub fn add_project_note(state: State<DbState>, project_path: String, content: String, color: String) -> Result<Note, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    NoteService::add_note(&conn, &project_path, &content, &color)
}

#[tauri::command]
pub fn update_project_note(state: State<DbState>, id: i32, content: String, color: String) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    NoteService::update_note(&conn, id, &content, &color)
}

#[tauri::command]
pub fn delete_project_note(state: State<DbState>, id: i32) -> Result<(), String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    NoteService::delete_note(&conn, id)
}
