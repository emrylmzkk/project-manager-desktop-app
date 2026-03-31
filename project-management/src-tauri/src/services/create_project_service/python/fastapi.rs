use std::fs;
use crate::services::create_project_service::ProjectTemplate;
use crate::services::create_project_service::python::basic::PythonBasicTemplate;

pub struct PythonFastapiTemplate;

impl ProjectTemplate for PythonFastapiTemplate {
    fn create(&self, path: &str, project_name: &str) -> Result<(), String> {
        // reuse some basic functionality if needed or implement from scratch
        let basic = PythonBasicTemplate;
        basic.create(path, project_name)?;

        let full_path = format!("{}/{}", path, project_name);
        
        // Add FastAPI specific files
        Self::create_fastapi_files(&full_path)?;
        Self::update_requirements(&full_path)?;

        Ok(())
    }
}

impl PythonFastapiTemplate {
    fn create_fastapi_files(project_path: &str) -> Result<(), String> {
        let app_path = format!("{}/src/app", project_path);
        fs::create_dir_all(&app_path).map_err(|e| format!("app klasörü oluşturulamadı: {}", e))?;

        let main_py = r#"from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}
"#;
        fs::write(format!("{}/main.py", app_path), main_py)
            .map_err(|e| format!("fastapi main.py oluşturulamadı: {}", e))?;

        Ok(())
    }

    fn update_requirements(project_path: &str) -> Result<(), String> {
        let req_content = "fastapi\nuvicorn\n";
        fs::write(format!("{}/requirements.txt", project_path), req_content)
            .map_err(|e| format!("requirements.txt güncellenemedi: {}", e))?;
        Ok(())
    }
}
