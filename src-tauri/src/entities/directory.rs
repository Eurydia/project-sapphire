use serde::Serialize;

#[derive(Serialize)]
pub struct DirectoryData {
    pub path: String,
    pub files: Vec<String>,
    pub directories: Vec<String>,
}

impl Default for DirectoryData {
    fn default() -> Self {
        return Self {
            path: String::default(),
            files: Vec::default(),
            directories: Vec::default(),
        };
    }
}
