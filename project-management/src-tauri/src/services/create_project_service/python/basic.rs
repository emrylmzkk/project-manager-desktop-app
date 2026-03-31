use std::fs;
use std::path::Path;
use crate::services::create_project_service::ProjectTemplate;

pub struct PythonBasicTemplate;

impl ProjectTemplate for PythonBasicTemplate {
    fn create(&self, path: &str, project_name: &str) -> Result<(), String> {
        let new_path = format!("{}/{}", path, project_name);

        Self::create_project_dir(&new_path)?;
        Self::create_virtual_environment(&new_path)?;
        Self::create_python_template_files(&new_path)?;

        Ok(())
    }
}

impl PythonBasicTemplate {
    fn create_project_dir(new_path: &str) -> Result<(), String> {
        if Path::new(new_path).exists() {
            return Err(format!("Klasör zaten mevcut"));
        }

        fs::create_dir_all(new_path)
            .map_err(|e| format!("Klasör oluşturulurken hata meydana geldi, {}", e))
    }

    fn create_virtual_environment(project_path: &str) -> Result<(), String> {
        // Sistemde "python3" yoksa "python" ile dener
        let output = crate::services::create_command("python3")
            .current_dir(project_path)
            .args(["-m", "venv", ".venv"])
            .output();

        let output = match output {
            Ok(o) => o,
            Err(_) => {
                // python3 bulunamadıysa python ile dene
                crate::services::create_command("python")
                    .current_dir(project_path)
                    .args(["-m", "venv", ".venv"])
                    .output()
                    .map_err(|e| format!("Python bulunamadı veya venv oluşturulamadı: {}", e))?
            }
        };

        if output.status.success() {
            Ok(())
        } else {
            Err(String::from_utf8_lossy(&output.stderr).trim().to_string())
        }
    }

    fn create_python_template_files(project_path: &str) -> Result<(), String> {
        let src_path = format!("{}/src", project_path);
        let main_path = format!("{}/main.py", project_path);
        let requirements_path = format!("{}/requirements.txt", project_path);
        let readme_path = format!("{}/README.md", project_path);
        let gitignore_path = format!("{}/.gitignore", project_path);

        // src klasörünü oluştur
        fs::create_dir_all(&src_path).map_err(|e| format!("src klasörü oluşturulamadı: {}", e))?;

        fs::write(&main_path, "print('Hello, Python!')")
            .map_err(|e| format!("main.py dosyası oluşturulamadı: {}", e))?;

        // requirements.txt dosyasını oluştur
        let requirements_content = "";
        fs::write(&requirements_path, requirements_content)
            .map_err(|e| format!("requirements.txt dosyası oluşturulamadı: {}", e))?;

        // README.md dosyasını oluştur
        let readme_content = format!("# {}\n\nCreated with Project Manager", project_path.split('/').last().unwrap_or("Project"));
        fs::write(&readme_path, readme_content)
            .map_err(|e| format!("README.md dosyası oluşturulamadı: {}", e))?;

        let gitignore_content = Self::gitignore_template();
        fs::write(&gitignore_path, gitignore_content)
            .map_err(|e| format!(".gitignore dosyası oluşturulamadı: {}", e))?;

        Ok(())
    }

    fn gitignore_template() -> String {
        r#"# Virtual environment
.venv/
venv/
env/

# Python cache
__pycache__/
*.py[cod]

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Environment variables
.env
"#
        .to_string()
    }
}
