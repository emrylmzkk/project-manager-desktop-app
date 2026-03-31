use crate::models::git_model::{GitActivity, GitCommit, GitDetails, MergeResult};
use std::collections::HashMap;

pub struct GitService;

impl GitService {
    // Tüm bilgileri toplayıp frontende dönen ana fonksiyon
    pub fn get_git_details(path: &str) -> Result<GitDetails, String> {
        let current_branch = Self::get_current_branch(path)?;
        let branches = Self::get_branches(path)?;
        let recent_commits = Self::get_recent_commits(path, 5)?; // Son 5 commit'i alıyoruz
        let commit_activity = Self::get_commit_activities(path)?;
        let remote_url = Self::get_remote_url(path);

        Ok(GitDetails {
            current_branch,
            branches,
            recent_commits,
            commit_activity,
            remote_url,
        })
    }

    // Aktif Branch'ı bulur
    fn get_current_branch(path: &str) -> Result<String, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["rev-parse", "--abbrev-ref", "HEAD"])
            .output()
            .map_err(|e| format!("Git komutu çalıştırılamadı: {}", e))?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
        } else {
            Err("Aktif branch bulunamadı".to_string())
        }
    }

    // Remote URL'i bulur
    fn get_remote_url(path: &str) -> Option<String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["config", "--get", "remote.origin.url"])
            .output()
            .ok()?;

        if output.status.success() {
            let url = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !url.is_empty() {
                return Some(url);
            }
        }
        None
    }

    // Projedeki Tüm Branch'leri Listeler
    fn get_branches(path: &str) -> Result<Vec<String>, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["branch", "--format=%(refname:short)"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let branches_str = String::from_utf8_lossy(&output.stdout);
            let branches: Vec<String> = branches_str
                .lines()
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
            Ok(branches)
        } else {
            Ok(vec![])
        }
    }

    // Son commitleri (Hash, Mesaj, Yazar, Tarih formatında) ayrıştırıp getirir
    fn get_recent_commits(path: &str, count: usize) -> Result<Vec<GitCommit>, String> {
        let count_str = format!("-{}", count);
        // %H: Hash, %s: Mesaj, %an: Yazar, %ad: Tarih (Hepsi | simgesi ile ayrılıyor)
        let format_str = "--pretty=format:%H|%s|%an|%ad";

        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["log", &count_str, format_str, "--date=short"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let commits_str = String::from_utf8_lossy(&output.stdout);
            let mut commits = Vec::new();

            for line in commits_str.lines() {
                let parts: Vec<&str> = line.splitn(4, '|').collect();
                if parts.len() == 4 {
                    commits.push(GitCommit {
                        hash: parts[0].to_string(),
                        message: parts[1].to_string(),
                        author: parts[2].to_string(),
                        date: parts[3].to_string(),
                    });
                }
            }
            Ok(commits)
        } else {
            Ok(vec![])
        }
    }

    // Projenin başlangıcından bu yana günlere göre commit sayılarını ve Github-like seviyesini (0-4) döner
    fn get_commit_activities(path: &str) -> Result<Vec<GitActivity>, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["log", "--format=%ad", "--date=short"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let dates_str = String::from_utf8_lossy(&output.stdout);
            let mut counts: HashMap<String, u32> = HashMap::new();

            for line in dates_str.lines() {
                let date = line.trim().to_string();
                if !date.is_empty() {
                    *counts.entry(date).or_insert(0) += 1;
                }
            }

            let mut activities: Vec<GitActivity> = counts
                .into_iter()
                .map(|(date, count)| {
                    let level = match count {
                        0 => 0,
                        1..=2 => 1,
                        3..=5 => 2,
                        6..=9 => 3,
                        _ => 4,
                    };
                    GitActivity { date, count, level }
                })
                .collect();

            // Tarihe göre sırala (Eskiden yeniye)
            activities.sort_by(|a, b| a.date.cmp(&b.date));

            Ok(activities)
        } else {
            Ok(vec![])
        }
    }

    // Git Add All Komutu
    pub fn git_add(path: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["add", "."])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err("Git add başarısız eklenecek bir şey yok veya yetki sorunu".to_string())
        }
    }

    // Git Commit Komutu
    pub fn git_commit(path: &str, message: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["commit", "-m", message])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err("Git commit başarısız, bir değişiklik olmayabilir".to_string())
        }
    }

    // Git Push Komutu
    pub fn git_push(path: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["push"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err("Git push başarısız (Remote yok veya auth gerekiyor)".to_string())
        }
    }

    // Git Checkout Komutu
    pub fn git_checkout(path: &str, branch_name: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["checkout", branch_name])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    pub fn git_status(path: &str) -> Result<String, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["status"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).to_string())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    // Git Stash Komutu
    pub fn git_stash(path: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["stash"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err("Git stash başarısız".to_string())
        }
    }

    // Git Init (Yeni Repo Oluşturma)
    pub fn git_init(path: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["init"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    // Git Remote Add
    pub fn git_remote_add(path: &str, url: &str) -> Result<(), String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["remote", "add", "origin", url])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    // Git Branch -M main and Push -u origin main
    pub fn git_push_initial(path: &str) -> Result<(), String> {
        // İlk olarak branch ismini main yapalım
        let _ = crate::services::create_command("git")
            .current_dir(path)
            .args(["branch", "-M", "main"])
            .output();

        // Push işlemi
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["push", "-u", "origin", "main"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).to_string())
        }
    }

    pub fn git_pull(path: &str) -> Result<String, String> {
        let current_branch = Self::get_current_branch(path)?;

        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["pull", "origin", &current_branch])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            Ok(String::from_utf8_lossy(&output.stdout).trim().to_string())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
        }
    }

    pub fn git_fetch(path: &str) -> Result<String, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["fetch", "--all", "--prune"]) // --prune: silinmiş remote branch'leri temizler
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            // fetch başarılı ama stdout genelde boş olur, stderr'de bilgi gelir (git'in özelliği)
            let out = String::from_utf8_lossy(&output.stdout).trim().to_string();
            let err = String::from_utf8_lossy(&output.stderr).trim().to_string();
            Ok(if out.is_empty() { err } else { out })
        } else {
            Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
        }
    }

    pub fn git_clone(target_path: &str, url: &str) -> Result<String, String> {
        let is_https = url.starts_with("https://");
        let is_ssh = url.starts_with("git@");

        if !is_https && !is_ssh {
            return Err("Geçersiz Clone formatı".to_string());
        }

        let output = crate::services::create_command("git")
            .current_dir(target_path)
            .args(["clone", url])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let msg = String::from_utf8_lossy(&output.stderr).trim().to_string();
            Ok(msg)
        } else {
            Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
        }
    }

    pub fn git_merge(path: &str, branch_name: &str) -> Result<MergeResult, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["merge", branch_name])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let output_msg = String::from_utf8_lossy(&output.stdout).trim().to_string();
            return Ok(MergeResult::Success(output_msg));
        }

        let stderr = String::from_utf8_lossy(&output.stderr).to_string();
        let stdout = String::from_utf8_lossy(&output.stdout).to_string();

        let is_conflict = stdout.contains("CONFLICT") || stderr.contains("Merge conflict");

        if is_conflict {
            let conflicted_files = Self::get_conflicted_files(path)?;
            return Ok(MergeResult::Conflict(conflicted_files));
        }

        Err(stderr)
    }

    pub fn get_conflicted_files(path: &str) -> Result<Vec<String>, String> {
        let output = crate::services::create_command("git")
            .current_dir(path)
            .args(["diff", "--name-only", "--diff-filter=U"])
            .output()
            .map_err(|e| e.to_string())?;

        if output.status.success() {
            let files = String::from_utf8_lossy(&output.stdout)
                .lines()
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
                .collect();
            Ok(files)
        } else {
            Ok(vec![])
        }
    }
}
