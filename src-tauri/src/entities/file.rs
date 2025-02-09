use serde::Serialize;
use std::fs::File;

#[derive(Serialize)]
pub struct FileData {
    path: String,
    name: String,
    content: String,
}

impl Default for FileData {
    fn default() -> Self {
        Self {
            path: String::default(),
            name: String::default(),
            content: String::default(),
        }
    }
}

impl FileData {
    pub fn new(path: String, name: String, content: String) -> Self {
        Self {
            path,
            name,
            content,
        }
    }
}
