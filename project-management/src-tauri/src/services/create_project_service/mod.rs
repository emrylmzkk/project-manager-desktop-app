pub mod python;

pub trait ProjectTemplate {
    fn create(&self, path: &str, project_name: &str) -> Result<(), String>;
}

pub struct TemplateFactory;

impl TemplateFactory {
    pub fn get_template(template_id: &str) -> Result<Box<dyn ProjectTemplate>, String> {
        match template_id {
            "python" => Ok(Box::new(python::basic::PythonBasicTemplate)),
            "fastapi" => Ok(Box::new(python::fastapi::PythonFastapiTemplate)),
            _ => Err(format!("Template bulunamadı: {}", template_id)),
        }
    }
}
