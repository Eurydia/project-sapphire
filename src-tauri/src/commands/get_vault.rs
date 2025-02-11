use crate::entities::{
    app::SapphireAppConfig,
    repository::{RepositoryEntry, VaultData},
};
use serde::Serialize;
use std::{fs::read_dir, path::Path, time::SystemTime};
use tauri::{Manager, Runtime};

#[tauri::command]
pub fn get_vault<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<VaultData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or_else(|| "Cannot access app state")?;
    let vault_dir_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or_else(|| "Path to vault is not set")?;
    let vault_dir_path = Path::new(&vault_dir_path_string);

    if !vault_dir_path.try_exists().unwrap() {
        return Err(String::from("Configured vault dir does not exist"));
    }

    let entries = read_dir(vault_dir_path).unwrap();
    let mut repository_entries: Vec<RepositoryEntry> = Vec::new();
    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };

        let repository_path = entry.path();
        if repository_path.is_dir() {
            let relative_repository_path =
                match repository_path.strip_prefix(vault_dir_path) {
                    Ok(result) => result,
                    Err(_) => continue,
                };

            let relative_repository_path_string = match relative_repository_path
                .to_path_buf()
                .into_os_string()
                .into_string()
            {
                Ok(result) => result,
                Err(_) => continue,
            };

            let dir_name_string = match relative_repository_path.file_name() {
                Some(os_string) => match os_string.to_os_string().into_string()
                {
                    Ok(result) => result,
                    Err(_) => continue,
                },
                None => continue,
            };

            let Ok(metadata) = repository_path.metadata() else {
                continue;
            };

            repository_entries.push(RepositoryEntry {
                name: dir_name_string,
                path: relative_repository_path_string,
            })
        }
    }

    let name = vault_dir_path
        .file_name()
        .unwrap()
        .to_os_string()
        .into_string()
        .unwrap();
    Ok(VaultData {
        repositories: repository_entries,
        name,
    })
}
