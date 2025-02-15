use std::{
    fs::{read_dir, read_to_string},
    path::Path,
};

use tauri::{Manager, Runtime};

use crate::entities::{
    app::SapphireAppConfig,
    directory::{DirectoryData, DirectoryEntry, FileEntry},
    file,
};

#[tauri::command]
pub fn get_directory<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<DirectoryData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or("Cannot access app state")?;
    let vault_dir_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or("Path to vault is not set")?;
    let vault_dir_path = Path::new(&vault_dir_path_string);
    let repository_path = vault_dir_path.join(&path);

    let mut readme_content: Option<String> = Option::None;
    let mut files: Vec<FileEntry> = Vec::new();
    let mut directories: Vec<DirectoryEntry> = Vec::new();
    let entries = read_dir(repository_path)
        .map_err(|_| "Cannot read directory content")?;

    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };

        let entry_path = entry.path();
        let Ok(relative_entry_path) = entry_path.strip_prefix(vault_dir_path)
        else {
            continue;
        };
        let Some(name_string) =
            relative_entry_path
                .file_name()
                .and_then(|file_name_os_str| {
                    return file_name_os_str.to_os_string().into_string().ok();
                })
        else {
            continue;
        };
        let Ok(relative_entry_path_string) = relative_entry_path
            .to_path_buf()
            .into_os_string()
            .into_string()
        else {
            continue;
        };

        if entry_path.is_dir() {
            directories.push(DirectoryEntry {
                name: name_string,
                path: relative_entry_path_string,
            })
        } else if entry_path.is_file() {
            if readme_content.is_none()
                && name_string.to_lowercase().starts_with("readme")
            {
                readme_content = read_to_string(entry_path).ok();
            }

            files.push(FileEntry {
                name: name_string,
                path: relative_entry_path_string,
            });
        }
    }
    let vault_name = vault_dir_path
        .file_name()
        .and_then(|file_name_os_str| {
            return file_name_os_str.to_os_string().into_string().ok();
        })
        .ok_or("Cannot transform vault name to String")?;

    return Ok(DirectoryData {
        vault_name,
        path,
        files,
        directories,
        readme: readme_content,
    });
}
