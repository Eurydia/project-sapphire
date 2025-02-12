use std::{
    fs::{read_to_string, write},
    path::Path,
};

use tauri::{utils::config::AppConfig, Manager, Runtime};

use crate::entities::{app::SapphireAppConfig, vault::VaultConfig};

#[tauri::command]
pub async fn create_vault_collection<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    name: String,
    repositories: Vec<String>,
) -> Result<bool, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or("Cannot access app config")?;

    let vault_dir_string = app_config
        .base_dir
        .as_ref()
        .ok_or("Path to vault is not set")?;
    let vault_dir_path = Path::new(vault_dir_string);
    let vault_config_file_path = vault_dir_path.join(".sapphire.vault.config");

    let vault_config_content_string =
        read_to_string(&vault_config_file_path)
            .map_err(|_| "Cannot read config file content")?;

    let mut vault_config: VaultConfig =
        serde_json::from_str(&vault_config_content_string)
            .map_err(|_| "Cannot deserialize config")?;

    vault_config.collections.insert(name, repositories);

    let updated_vault_config_content_string =
        serde_json::to_string_pretty(&vault_config)
            .map_err(|_| "Cannot serialize updated config content")?;

    write(vault_config_file_path, updated_vault_config_content_string)
        .map_err(|_| " Cannot write updated config content to file")?;

    return Ok(true);
}
