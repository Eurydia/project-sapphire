use serde::{Deserialize, Serialize};
use std::{collections::HashMap, default, string};

#[derive(Serialize, Deserialize)]
pub struct VaultData {
    pub config: VaultConfig,
    pub repositories: Vec<String>,
    pub name: String,
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
