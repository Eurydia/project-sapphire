use std::{
    fs::{read_to_string, write},
    path::{Path, PathBuf},
};

use crate::entities::{app::SapphireAppConfig, file};

pub fn get_app_config(path: &Path) -> Result<SapphireAppConfig, String> {
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

pub fn update_vault_path(
    path: &Path,
    vault_path_string: String,
) -> Result<(), String> {
    let mut app_config = get_app_config(path)?;

    let cleaned_vault_path = Path::new(&vault_path_string);
    let cleaned_vault_path_string = cleaned_vault_path
        .as_os_str()
        .to_os_string()
        .into_string()
        .ok();

    app_config.base_dir = cleaned_vault_path_string;

    let new_app_config_string = serde_json::to_string_pretty(&app_config)
        .map_err(|err| err.to_string())?;

    write(path, new_app_config_string).map_err(|err| err.to_string())?;
    return Ok(());
}
