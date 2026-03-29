use rusqlite::{params, Connection, Result};
use crate::models::note_model::Note;

pub struct NoteService;

impl NoteService {
    pub fn get_notes(conn: &Connection, project_path: &str) -> Result<Vec<Note>, String> {
        let mut stmt = conn.prepare("SELECT id, project_path, content, color, updated_at FROM notes WHERE project_path = ? ORDER BY id DESC")
            .map_err(|e| e.to_string())?;
        
        let note_iter = stmt.query_map(params![project_path], |row| {
            Ok(Note {
                id: Some(row.get(0)?),
                project_path: row.get(1)?,
                content: row.get(2)?,
                color: Some(row.get(3)?),
                updated_at: Some(row.get(4)?),
            })
        }).map_err(|e| e.to_string())?;

        let mut notes = Vec::new();
        for note in note_iter {
            notes.push(note.map_err(|e| e.to_string())?);
        }
        Ok(notes)
    }

    pub fn add_note(conn: &Connection, project_path: &str, content: &str, color: &str) -> Result<Note, String> {
        conn.execute(
            "INSERT INTO notes (project_path, content, color, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
            params![project_path, content, color],
        ).map_err(|e| e.to_string())?;

        let id = conn.last_insert_rowid();
        
        Ok(Note {
            id: Some(id as i32),
            project_path: project_path.to_string(),
            content: content.to_string(),
            color: Some(color.to_string()),
            updated_at: Some(chrono::Local::now().to_rfc3339()),
        })
    }

    pub fn update_note(conn: &Connection, id: i32, content: &str, color: &str) -> Result<(), String> {
        conn.execute(
            "UPDATE notes SET content = ?, color = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
            params![content, color, id],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn delete_note(conn: &Connection, id: i32) -> Result<(), String> {
        conn.execute("DELETE FROM notes WHERE id = ?", params![id])
            .map_err(|e| e.to_string())?;
        Ok(())
    }
}
