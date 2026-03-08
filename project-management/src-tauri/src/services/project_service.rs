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

    pub fn get_projects_from_paths(paths: Vec<String>) -> Vec<Project> {
        paths
            .into_iter()
            .filter_map(|p| Self::get_project_info(&p))
            .collect()
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
    // 1. Komutu ve argümanları topla 
    // Tüm tipleri (String, Vec<String>) yaparak tür uyuşmazlığını ve leak gereksinimini ortadan kaldırıyoruz.
    let (command, args): (String, Vec<String>) = match std::env::consts::OS {
        "windows" => {
            match ide {
                "vscode" => ("cmd".to_string(), vec!["/c".to_string(), "code".to_string(), path.to_string()]),
                "cursor" => ("cmd".to_string(), vec!["/c".to_string(), "cursor".to_string(), path.to_string()]),
                "visualstudio" => {
                    if let Some(vs_path) = Self::get_visual_studio_path() {
                        // Terminalde başarıyla çalışan tam yol mantığı
                        (vs_path, vec![path.to_string()])
                    } else {
                        // Fallback: Eğer yol bulunamazsa eski yöntemi dene
                        ("cmd".to_string(), vec!["/c".to_string(), "start".to_string(), "devenv".to_string(), path.to_string()])
                    }
                }
                "antigravity" => ("cmd".to_string(), vec!["/c".to_string(), "antigravity".to_string(), path.to_string()]),
                _ => ("cmd".to_string(), vec!["/c".to_string(), ide.to_string(), path.to_string()]),
            }
        }
        "macos" => {
            let app_name = match ide {
                "vscode" => "Visual Studio Code",
                "cursor" => "Cursor",
                "antigravity" => "Antigravity",
                _ => ide,
            };
            ("open".to_string(), vec!["-a".to_string(), app_name.to_string(), path.to_string()])
        }
        _ => {
            // Linux ve Diğerleri
            let exe = match ide {
                "vscode" => "code",
                "cursor" => "cursor",
                "visualstudio" => "devenv",
                _ => ide,
            };
            (exe.to_string(), vec![path.to_string()])
        }
    };

    // 2. Komutu oluştur (String referansı &command kullanarak)
    let mut command_to_run = crate::services::create_command(&command);
    command_to_run.args(&args);

    match command_to_run.output() {
        Ok(output) => {
            if output.status.success() {
                Ok(())
            } else {
                let stderr = String::from_utf8_lossy(&output.stderr);
                Err(format!("Uygulama açılamadı (Hata Kodu: {}): {}", output.status, stderr))
            }
        }
        Err(e) => Err(format!("IDE başlatılamadı (Sistem Hatası): {}", e)),
    }
}

    // pub fn open_in_ide(path: &str, ide: &str) -> Result<(), String> {
    //     let (command, args) = match std::env::consts::OS {
    //         // "windows" => {
    //         //     let args = match ide {
    //         //         "vscode" => vec!["/c", "code", path],
    //         //         "cursor" => vec!["/c", "cursor", path],
    //         //         //"visualstudio" => vec!["/c", "start", "devenv", path],
    //         //         "visualstudio" => {

    //         //             if let Some(vs_path) = Self::get_visual_studio_path() {
    //         //                 (vs_path.leak(), vec![path])
    //         //             } else {
    //         //                 ("cmd", vec!["/c", "start", "devenv", path])
    //         //             }
    //         //         },
    //         //         "antigravity" => vec!["/c", "antigravity", path],
    //         //         _ => vec!["/c", ide, path],
    //         //     };
    //         //     ("cmd", args)
    //         // }

    //         "windows" => {
    //         match ide {
    //             "vscode" => ("cmd", vec!["/c", "code", path]),
    //             "cursor" => ("cmd", vec!["/c", "cursor", path]),
    //             "visualstudio" => {
    //                 if let Some(vs_exec) = Self::get_visual_studio_path() {
    //                     let cmd: &str = Box::leak(vs_exec.into_boxed_str());
    //                     (cmd, vec![path])
    //                 } else {
    //                     ("cmd", vec!["/c", "start", "devenv", path])
    //                 }
    //             }
    //             "antigravity" => ("cmd", vec!["/c", "antigravity", path]),
    //             _ => ("cmd", vec!["/c", ide, path]),
    //         }
    //     }
    //         "macos" => {
    //             let app_name = match ide {
    //                 "vscode" => "Visual Studio Code",
    //                 "cursor" => "Cursor",
    //                 "antigravity" => "Antigravity",
    //                 _ => ide,
    //             };
    //             ("open", vec!["-a", app_name, path])
    //         }
    //         _ => {
    //             // Linux ve Diğerleri
    //             let cmd = match ide {
    //                 "vscode" => "code",
    //                 "cursor" => "cursor",
    //                 "visualstudio" => "devenv",
    //                 "antigravity" => "antigravity",
    //                 _ => ide,
    //             };
    //             (cmd, vec![path])
    //         }
    //     };

    //     let mut command_to_run = crate::services::create_command(command);
    //     command_to_run.args(&args);

    //     match command_to_run.output() {
    //         Ok(output) => {
    //             if output.status.success() {
    //                 Ok(())
    //             } else {
    //                 let stderr = String::from_utf8_lossy(&output.stderr);
    //                 Err(format!("Uygulama açılamadı veya bulunamadı: {}", stderr))
    //             }
    //         }
    //         Err(e) => Err(format!("IDE açılamadı: {}", e)),
    //     }
    // }

    pub fn open_in_file_explorer(path: &str) -> Result<(), String> {
        #[cfg(target_os = "windows")]
        let result = crate::services::create_command("explorer").arg(path).spawn();

        #[cfg(target_os = "macos")]
        let result = crate::services::create_command("open").arg(path).spawn();

        #[cfg(target_os = "linux")]
        let result = crate::services::create_command("xdg-open").arg(path).spawn();

        match result {
            Ok(_) => Ok(()),
            Err(e) => Err(format!("Dosya gezgini açılamadı: {}", e)),
        }
    }

    // fn get_visual_studio_path() -> Option<String> {

    //     #[cfg(target_os = "windows")]
    //     {

    //         let vs_path = "C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe"

    //         let output = std::process::Command::new(vs_path)
    //             .args(&["-latest", "-products", "*", "-property", "productPath"])
    //             .output()
    //             .ok()?;

    //         if output.status.success() {
    //             let path = String::from_utf8_lossy(&output.stdout).trim().to_string();

    //             if !path.is_empty() {
    //                 return Some(path)
    //             }
    //         }


    //     }

    //     None

    // }

    fn get_visual_studio_path() -> Option<String> {
    #[cfg(target_os = "windows")]
    {
        let vswhere = "C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\vswhere.exe";
        
        let output = std::process::Command::new(vswhere)
            .args(&["-latest", "-products", "*", "-property", "productPath"])
            .output()
            .ok()?;

        if output.status.success() {
            let path = String::from_utf8_lossy(&output.stdout).trim().to_string();
            if !path.is_empty() && std::path::Path::new(&path).exists() {
                return Some(path);
            }
        }
    }
    None
}
}
