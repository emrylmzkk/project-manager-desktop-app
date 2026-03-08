use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct GitAccount {
    pub name: String,
    pub email: String,
    pub source: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct DiskInfo {
    pub name: String,
    pub mount_point: String,
    pub total_space_gb: f64,
    pub available_space_gb: f64,
    pub is_removable: bool,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct SystemMetrics {
    pub cpu_usage: f32,
    pub total_ram_gb: f64,
    pub used_ram_gb: f64,
    pub disks: Vec<DiskInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct SystemInfo {
    pub os: String,
    pub git_accounts: Vec<GitAccount>,
    pub metrics: SystemMetrics,
}
