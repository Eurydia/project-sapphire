use std::{
    fs::{read_to_string, write},
    path::{Path, PathBuf},
};

use crate::entities::{app::SapphireAppConfig, file};

pub fn load_app_config(path: &Path) -> Result<SapphireAppConfig, String> {
    let config_file_content =
        read_to_string(path).map_err(|_| "Cannot content in config file")?;
    let app_config =
        serde_json::from_str::<SapphireAppConfig>(&config_file_content)
            .map_err(|_| "Cannot deserialize config")?;
    return Ok(app_config);
}

pub fn create_or_restore_app_config(path: &Path) -> Result<(), String> {
    let app_config = SapphireAppConfig::default();
    let app_config_string = serde_json::to_string_pretty(&app_config)
        .map_err(|_| "Cannot serialize config")?;
    write(path, app_config_string)
        .map_err(|_| "Cannot write config to file")?;
    return Ok(());
}
