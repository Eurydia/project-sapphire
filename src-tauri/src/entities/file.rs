use serde::Serialize;
use std::fs::File;

#[derive(Serialize)]
pub struct FileData {
    pub vault_name: String,
    pub path: String,
    pub name: String,
    pub content: String,
}
