use rusqlite::{params, Connection, Result};
use crate::models::todo_model::Todo;

pub struct TodoService;

impl TodoService {
    pub fn get_todos(conn: &Connection, project_path: &str) -> Result<Vec<Todo>, String> {
        let mut stmt = conn.prepare("SELECT id, project_path, task, is_completed, item_order, created_at FROM todos WHERE project_path = ? ORDER BY item_order ASC, id DESC")
            .map_err(|e| e.to_string())?;
        
        let todo_iter = stmt.query_map(params![project_path], |row| {
            Ok(Todo {
                id: Some(row.get(0)?),
                project_path: row.get(1)?,
                task: row.get(2)?,
                is_completed: row.get(3)?,
                item_order: row.get(4)?,
                created_at: Some(row.get(5)?),
            })
        }).map_err(|e| e.to_string())?;

        let mut todos = Vec::new();
        for todo in todo_iter {
            todos.push(todo.map_err(|e| e.to_string())?);
        }
        Ok(todos)
    }

    pub fn add_todo(conn: &Connection, project_path: &str, task: &str) -> Result<Todo, String> {
        // Get current max order
        let max_order: i32 = conn.query_row(
            "SELECT COALESCE(MAX(item_order), -1) FROM todos WHERE project_path = ?",
            params![project_path],
            |row| row.get(0)
        ).unwrap_or(0);

        let new_order = max_order + 1;

        conn.execute(
            "INSERT INTO todos (project_path, task, is_completed, item_order) VALUES (?, ?, 0, ?)",
            params![project_path, task, new_order],
        ).map_err(|e| e.to_string())?;

        let id = conn.last_insert_rowid();
        
        Ok(Todo {
            id: Some(id as i32),
            project_path: project_path.to_string(),
            task: task.to_string(),
            is_completed: false,
            item_order: new_order,
            created_at: Some(chrono::Local::now().to_rfc3339()),
        })
    }

    pub fn toggle_todo(conn: &Connection, id: i32, is_completed: bool) -> Result<(), String> {
        conn.execute(
            "UPDATE todos SET is_completed = ? WHERE id = ?",
            params![is_completed, id],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn update_todo_order(conn: &Connection, id: i32, new_order: i32) -> Result<(), String> {
        conn.execute(
            "UPDATE todos SET item_order = ? WHERE id = ?",
            params![new_order, id],
        ).map_err(|e| e.to_string())?;
        Ok(())
    }

    pub fn delete_todo(conn: &Connection, id: i32) -> Result<(), String> {
        conn.execute("DELETE FROM todos WHERE id = ?", params![id])
            .map_err(|e| e.to_string())?;
        Ok(())
    }
}
