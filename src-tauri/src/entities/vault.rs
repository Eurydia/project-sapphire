use serde::{Deserialize, Serialize};
use std::{collections::HashMap, default, string};

#[derive(Serialize)]
pub struct VaultData {
    pub config: VaultConfig,
    pub repositories: Vec<RepositoryEntry>,
    pub name: String,
}

#[derive(Serialize)]
pub struct RepositoryEntry {
    pub name: String,
    pub path: String,
}

#[derive(Serialize, Deserialize)]
pub struct VaultConfig {
    pub collections: HashMap<String, Vec<String>>,
}

impl Default for VaultConfig {
    fn default() -> Self {
        Self {
            collections: HashMap::new(),
        }
    }
}
