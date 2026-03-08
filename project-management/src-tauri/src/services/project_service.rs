use crate::models::project_model::{FileNode, Project};
use std::fs;
use std::path::Path;

pub struct ProjectService;

impl ProjectService {
    pub fn scan_directory(base_path: &str) -> Vec<Project> {
        let mut projects = Vec::new();

        if let Ok(entries) = fs::read_dir(base_path) {
            for entry in entries.flatten() {
                let path = entry.path();

                if path.is_dir() {
                    let name = path
                        .file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("Bilinmeyen Proje")
                        .to_string();

                    let is_git = path.join(".git").exists();

                    projects.push(Project {
                        name,
                        path: path.to_string_lossy().to_string(),
                        is_git,
                    });
                }
            }
        }

        projects
    }

    // Yeni: Tek bir klasörü proje olarak almak için
    pub fn get_project_info(path_str: &str) -> Option<Project> {
        let path = Path::new(path_str);
        if path.is_dir() {
            let name = path
                .file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("Bilinmeyen Proje")
                .to_string();

            let is_git = path.join(".git").exists();

            Some(Project {
                name,
                path: path_str.to_string(),
                is_git,
            })
        } else {
            None
        }
    }

    pub fn get_file_tree(dir_path: &str, max_depth: u8) -> Vec<FileNode> {
        Self::read_directory(Path::new(dir_path), 0, max_depth)
    }

    fn read_directory(path: &Path, current_depth: u8, max_depth: u8) -> Vec<FileNode> {
        let mut nodes = Vec::new();
        if current_depth >= max_depth {
            return nodes;
        } // Çok derine inip uygulamayı dondurmamak için

        if let Ok(entries) = fs::read_dir(path) {
            for entry in entries.flatten() {
                let entry_path = entry.path();
                let name = entry.file_name().to_string_lossy().to_string();

                // .git veya node_modules gibi ağır kasörleri ağaçta görmezden gelmek için
                if name == ".git" || name == "node_modules" || name == "target" || name == "dist" {
                    continue; // Atla
                }

                let is_dir = entry_path.is_dir();

                // Klasörse, içindeki dosyaları da bul (Recursive)
                let children = if is_dir {
                    Some(Self::read_directory(
                        &entry_path,
                        current_depth + 1,
                        max_depth,
                    ))
                } else {
                    None
                };

                nodes.push(FileNode {
                    name,
                    path: entry_path.to_string_lossy().to_string(),
                    is_dir,
                    children,
                });
            }
        }

        // Klasörler başta, dosyalar sonda görünecek şekilde alfabetik sırala
        nodes.sort_by(|a, b| b.is_dir.cmp(&a.is_dir).then(a.name.cmp(&b.name)));

        nodes
    }

    pub fn open_in_ide(path: &str, ide: &str) -> Result<(), String> {
        let (command, args) = match std::env::consts::OS {
            "windows" => {
                let args = match ide {
                    "vscode" => vec!["/c", "code", path],
                    "cursor" => vec!["/c", "cursor", path],
                    "visualstudio" => vec!["/c", "devenv", path],
                    "antigravity" => vec!["/c", "antigravity", path],
                    _ => vec!["/c", ide, path],
                };
                ("cmd", args)
            }
            "macos" => {
                let app_name = match ide {
                    "vscode" => "Visual Studio Code",
                    "cursor" => "Cursor",
                    "antigravity" => "Antigravity",
                    _ => ide,
                };
                ("open", vec!["-a", app_name, path])
            }
            _ => {
                // Linux ve Diğerleri
                let cmd = match ide {
                    "vscode" => "code",
                    "cursor" => "cursor",
                    "visualstudio" => "devenv",
                    "antigravity" => "antigravity",
                    _ => ide,
                };
                (cmd, vec![path])
            }
        };

        let mut command_to_run = std::process::Command::new(command);
        command_to_run.args(&args);

        match command_to_run.output() {
            Ok(output) => {
                if output.status.success() {
                    Ok(())
                } else {
                    let stderr = String::from_utf8_lossy(&output.stderr);
                    Err(format!("Uygulama açılamadı veya bulunamadı: {}", stderr))
                }
            }
            Err(e) => Err(format!("IDE açılamadı: {}", e)),
        }
    }

    pub fn open_in_file_explorer(path: &str) -> Result<(), String> {
        #[cfg(target_os = "windows")]
        let result = std::process::Command::new("explorer").arg(path).spawn();

        #[cfg(target_os = "macos")]
        let result = std::process::Command::new("open").arg(path).spawn();

        #[cfg(target_os = "linux")]
        let result = std::process::Command::new("xdg-open").arg(path).spawn();

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Dosya gezgini açılamadı: {}", e)),
        }
    }
}
