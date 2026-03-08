use crate::models::system_model::SystemInfo;
use crate::services::system_service::SystemService;

#[tauri::command]
pub fn get_system_info() -> SystemInfo {
    SystemService::get_system_info()
}
