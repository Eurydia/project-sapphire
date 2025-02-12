use std::{collections::HashMap, default, fs::OpenOptions};

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct SapphireAppConfig {
    pub base_dir: Option<String>,
}

impl Default for SapphireAppConfig {
    fn default() -> SapphireAppConfig {
        SapphireAppConfig {
            base_dir: Option::None,
        }
    }
}
