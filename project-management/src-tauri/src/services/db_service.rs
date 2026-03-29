use rusqlite::{Connection, Result};
use std::fs;
use std::sync::Mutex;
use tauri::{AppHandle, Manager};

pub struct DbState(pub Mutex<Connection>);

pub struct DbService;

impl DbService {
    pub fn init(app_handle: &AppHandle) -> Result<Connection, String> {
        let app_dir = app_handle
            .path()
            .app_data_dir()
            .map_err(|e: tauri::Error| e.to_string())?;
        
        if !app_dir.exists() {
            fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
        }

        let db_path = app_dir.join("project_manager.db");
        let conn = Connection::open(db_path).map_err(|e| e.to_string())?;

        // Initialize tables
        conn.execute(
            "CREATE TABLE IF NOT EXISTS todos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_path TEXT NOT NULL,
                task TEXT NOT NULL,
                is_completed BOOLEAN NOT NULL DEFAULT 0,
                item_order INTEGER DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        ).map_err(|e| e.to_string())?;

        conn.execute(
            "CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                project_path TEXT NOT NULL,
                content TEXT NOT NULL,
                color TEXT DEFAULT '#fef08a',
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
            [],
        ).map_err(|e| e.to_string())?;

        Ok(conn)
    }
}
