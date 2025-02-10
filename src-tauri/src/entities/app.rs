use std::{default, fs::OpenOptions};

pub struct SapphireAppConfig {
    base_dir: Option<String>,
}

impl Default for SapphireAppConfig {
    fn default() -> SapphireAppConfig {
        SapphireAppConfig {
            base_dir: Option::None,
        }
    }
}

impl SapphireAppConfig {
    pub fn get_base_dir(&self) -> Option<String> {
        return &self.base_dir;
    }
}
