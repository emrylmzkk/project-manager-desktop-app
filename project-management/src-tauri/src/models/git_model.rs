use serde::{Deserialize, Serialize};

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
}
