use crate::services::create_project_service::TemplateFactory;
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
    let template = TemplateFactory::get_template(&template_id)?;
    template.create(&path, &project_name)?;

    let full_path = format!("{}/{}", path, project_name);
    Ok(TemplateResponse {
        success: true,
        message: format!("{} projesi başarıyla oluşturuldu", template_id),
        path: full_path,
    })
}

