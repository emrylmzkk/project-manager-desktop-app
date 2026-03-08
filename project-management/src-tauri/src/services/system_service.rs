use crate::models::system_model::{DiskInfo, GitAccount, SystemInfo, SystemMetrics};
use sysinfo::Disks;
use sysinfo::System;

pub struct SystemService;

impl SystemService {
    pub fn get_system_info() -> SystemInfo {
        let os = std::env::consts::OS.to_string();

        let mut git_accounts = Vec::new();

        // 1. Check global git user
        let global_name_opt = crate::services::create_command("git")
            .args(["config", "--global", "user.name"])
            .output()
            .ok()
            .and_then(|out| {
                if out.status.success() {
                    Some(String::from_utf8_lossy(&out.stdout).trim().to_string())
                } else {
                    None
                }
            });

        let global_email_opt = crate::services::create_command("git")
            .args(["config", "--global", "user.email"])
            .output()
            .ok()
            .and_then(|out| {
                if out.status.success() {
                    Some(String::from_utf8_lossy(&out.stdout).trim().to_string())
                } else {
                    None
                }
            });

        if let (Some(n), Some(e)) = (global_name_opt.clone(), global_email_opt.clone()) {
            if !n.is_empty() {
                git_accounts.push(GitAccount {
                    name: n,
                    email: e,
                    source: "Global Config".to_string(),
                });
            }
        }

        // 2. Try github cli for additional accounts
        if let Ok(gh_out) = crate::services::create_command("gh").args(["auth", "status"]).output() {
            let stderr = String::from_utf8_lossy(&gh_out.stderr).to_string(); // gh often prints to stderr
            let stdout = String::from_utf8_lossy(&gh_out.stdout).to_string();
            let combined = format!("{}{}", stdout, stderr);

            for line in combined.lines() {
                if line.contains("Logged in to") && line.contains("account") {
                    if let Some(idx) = line.find("account ") {
                        let mut parts = line[idx + 8..].split_whitespace();
                        if let Some(username) = parts.next() {
                            let clean_name = username.replace("(", "").replace(")", "");
                            // Prevent duplicating the global one if they happen to match exactly (though it's username vs display name)
                            let is_duplicate = git_accounts.iter().any(|a| a.name == clean_name);
                            if !is_duplicate {
                                git_accounts.push(GitAccount {
                                    name: clean_name,
                                    email: "GitHub CLI".to_string(),
                                    source: "GitHub Hesabı".to_string(),
                                });
                            }
                        }
                    }
                }
            }
        }

        // Metrikler
        let mut sys = System::new_all();
        sys.refresh_all();

        // Wait a tiny bit and refresh cpu to get a more accurate reading than 0
        std::thread::sleep(std::time::Duration::from_millis(50));
        sys.refresh_cpu_all();

        let cpu_usage = sys.global_cpu_usage();

        let total_ram_gb = sys.total_memory() as f64 / 1_073_741_824.0;
        let used_ram_gb = sys.used_memory() as f64 / 1_073_741_824.0;

        let disks_inf = Disks::new_with_refreshed_list();
        let mut disks = Vec::new();

        for disk in disks_inf.iter() {
            disks.push(DiskInfo {
                name: disk.name().to_string_lossy().to_string(),
                mount_point: disk.mount_point().to_string_lossy().to_string(),
                total_space_gb: disk.total_space() as f64 / 1_073_741_824.0,
                available_space_gb: disk.available_space() as f64 / 1_073_741_824.0,
                is_removable: disk.is_removable(),
            });
        }

        let metrics = SystemMetrics {
            cpu_usage,
            total_ram_gb,
            used_ram_gb,
            disks,
        };

        SystemInfo {
            os,
            git_accounts,
            metrics,
        }
    }
}
