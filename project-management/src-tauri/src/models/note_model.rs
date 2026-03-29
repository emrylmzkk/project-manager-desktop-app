use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Note {
    pub id: Option<i32>,
    pub project_path: String,
    pub content: String,
    pub color: Option<String>,
    pub updated_at: Option<String>,
}
