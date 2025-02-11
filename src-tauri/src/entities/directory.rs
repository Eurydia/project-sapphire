use serde::Serialize;

#[derive(Serialize)]
pub struct DirectoryData {
    pub vault_name: String,
    pub path: String,
    pub files: Vec<FileEntry>,
    pub directories: Vec<DirectoryEntry>,
}
#[derive(Serialize)]
pub struct DirectoryEntry {
    pub name: String,
    pub path: String,
}

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
}
