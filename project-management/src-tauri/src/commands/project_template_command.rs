use crate::services::create_project_service::python_template::PythonTemplateService;
use serde::Serialize;

#[derive(Serialize)]
pub struct TemplateResponse {
    pub success: bool,
    pub message: String,
    pub path: String,
}

#[tauri::command]
pub async fn create_project_from_template(
    template_id: String,
    path: String,
    project_name: String,
) -> Result<TemplateResponse, String> {
    match template_id.as_str() {
        "python" => {
            PythonTemplateService::create_new_project(&path, &project_name)?;
            let full_path = format!("{}/{}", path, project_name);
            Ok(TemplateResponse {
                success: true,
                message: "Python projesi başarıyla oluşturuldu".to_string(),
                path: full_path,
            })
        }
        _ => Err(format!("Bilinmeyen template: {}", template_id)),
    }
}

