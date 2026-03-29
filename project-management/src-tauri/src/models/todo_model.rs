use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Todo {
    pub id: Option<i32>,
    pub project_path: String,
    pub task: String,
    pub is_completed: bool,
    pub item_order: i32,
    pub created_at: Option<String>,
}
