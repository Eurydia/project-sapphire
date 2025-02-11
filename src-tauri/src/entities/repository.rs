use serde::Serialize;
use std::string;

#[derive(Serialize)]
pub struct VaultData {
    pub repositories: Vec<RepositoryEntry>,
    pub name: String,
}

#[derive(Serialize)]
pub struct RepositoryEntry {
    pub name: String,
    pub path: String,
}
