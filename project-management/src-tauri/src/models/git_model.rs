use serde::{Deserialize, Serialize};

//fn yardimiyla return edilecekse serialize derive zorunludur !!

#[derive(Serialize, Deserialize, Debug)]

pub struct GitCommit {
    pub hash: String,
    pub message: String,
    pub author: String,
    pub date: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GitActivity {
    pub date: String,
    pub count: u32,
    pub level: u8,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GitDetails {
    pub current_branch: String,
    pub branches: Vec<String>,
    pub recent_commits: Vec<GitCommit>,
    pub commit_activity: Vec<GitActivity>,
    pub remote_url: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
#[serde(tag = "type", content = "data")]
pub enum MergeResult {
    Success(String),
    Conflict(Vec<String>),
}
