use std::{fs::read_dir, path::Path};

use tauri::{Manager, Runtime};

use crate::entities::{
    app::SapphireAppConfig,
    directory::{DirectoryData, DirectoryEntry, FileEntry},
};

#[tauri::command]
pub fn get_directory<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<DirectoryData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or_else(|| "Cannot access app state")?;
    let vault_dir_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or_else(|| "Path to vault is not set")?;
    let vault_dir_path = Path::new(&vault_dir_path_string);
    let repository_path = vault_dir_path.join(&path);

    let mut files: Vec<FileEntry> = Vec::new();
    let mut directories: Vec<DirectoryEntry> = Vec::new();
    let entries = read_dir(repository_path).unwrap();

    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };

        let entry_path = entry.path();
        let Ok(relative_entry_path) = entry_path.strip_prefix(vault_dir_path)
        else {
            continue;
        };
        let name_string = match relative_entry_path.file_name() {
            Some(os_str) => match os_str.to_os_string().into_string() {
                Ok(ok) => ok,
                Err(_) => continue,
            },
            None => continue,
        };
        let relative_entry_path_string = match relative_entry_path
            .to_path_buf()
            .into_os_string()
            .into_string()
        {
            Ok(ok) => ok,
            Err(_) => continue,
        };
        if entry_path.is_dir() {
            directories.push(DirectoryEntry {
                name: name_string,
                path: relative_entry_path_string,
            })
        } else if entry_path.is_file() {
            files.push(FileEntry {
                name: name_string,
                path: relative_entry_path_string,
            });
        }
    }
    let vault_name = vault_dir_path
        .file_name()
        .unwrap()
        .to_os_string()
        .into_string()
        .unwrap();
    return Ok(DirectoryData {
        vault_name,
        path,
        files,
        directories,
    });
}
