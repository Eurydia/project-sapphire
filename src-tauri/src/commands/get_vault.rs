use crate::entities::{
    app::SapphireAppConfig,
    vault::{RepositoryEntry, VaultConfig, VaultData},
};
use serde::Serialize;
use std::{
    fmt::write,
    fs::{self, metadata, read_dir, read_to_string},
    path::{Path, PathBuf},
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{menu::AboutMetadata, utils::config, Manager, Runtime};

macro_rules! system_time_to_unix_time {
    ($e: expr) => {
        $e.ok()
            .and_then(|q| q.duration_since(UNIX_EPOCH).ok())
            .and_then(|r| Some(r.as_millis()));
    };
}

fn collect_repository_entries(
    vault_dir_path: &Path,
) -> Result<Vec<RepositoryEntry>, String> {
    let entries =
        read_dir(vault_dir_path).map_err(|_| "Cannot read vault entries")?;
    let mut repository_entries: Vec<RepositoryEntry> = Vec::new();
    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };

        let repository_path = entry.path();
        if !repository_path.is_dir() {
            continue;
        }
        let Ok(relative_repository_path) =
            repository_path.strip_prefix(vault_dir_path)
        else {
            continue;
        };

        let Ok(relative_repository_path_string) = relative_repository_path
            .to_path_buf()
            .into_os_string()
            .into_string()
        else {
            continue;
        };

        let Some(dir_name_string) = relative_repository_path
            .file_name()
            .and_then(|file_name_os_str| {
                file_name_os_str.to_os_string().into_string().ok()
            })
        else {
            continue;
        };

        let Ok(dir_metadata) = repository_path.metadata() else {
            continue;
        };

        let created_at = system_time_to_unix_time!(dir_metadata.created());
        let last_modified = system_time_to_unix_time!(dir_metadata.modified());
        let last_accessed = system_time_to_unix_time!(dir_metadata.accessed());

        let repository_config_file_path =
            repository_path.join(".sapphire.repository.config");

        let repository_config_string =
            read_to_string(relative_repository_path).ok();

        repository_entries.push(RepositoryEntry {
            name: dir_name_string,
            path: relative_repository_path_string,
            created_at,
            last_accessed,
            last_modified,
            description: repository_config_string,
        })
    }
    return Ok(repository_entries);
}

fn read_or_create_vault_config(path: &Path) -> Result<VaultConfig, String> {
    let config_file_path = path.join(".sapphire.vault.config");
    if !config_file_path
        .try_exists()
        .map_err(|_| "Cannot check if vault config file exist")?
    {
        let default_vault_config = VaultConfig::default();
        let default_vault_config_serialized =
            serde_json::to_string_pretty(&default_vault_config)
                .map_err(|_| "Cannot serialize default vault config")?;
        fs::write(config_file_path, default_vault_config_serialized).map_err(
            |_| "Cannot write serialized default vault config to file",
        )?;
        return Ok(default_vault_config);
    }
    let vault_config_string = read_to_string(&config_file_path)
        .map_err(|_| "Cannot read vault config file")?;
    let vault_config: VaultConfig = serde_json::from_str(&vault_config_string)
        .map_err(|_| "Cannot deserialize vault config")?;
    return Ok(vault_config);
}

#[tauri::command]
pub fn get_vault<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<VaultData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or("Cannot access app state")?;
    let vault_dir_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or("Path to vault is not set")?;
    let vault_dir_path = Path::new(&vault_dir_path_string);

    let repositories = collect_repository_entries(vault_dir_path)?;
    let config = read_or_create_vault_config(&vault_dir_path)?;
    let name = vault_dir_path
        .file_name()
        .ok_or("Cannot access vault name")?
        .to_os_string()
        .into_string()
        .map_err(|_| "Cannot convert OsString into String")?;
    Ok(VaultData {
        repositories,
        name,
        config,
    })
}
