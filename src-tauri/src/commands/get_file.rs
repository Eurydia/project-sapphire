use std::{
    fs::read_to_string,
    ops::{Deref, DerefMut},
    path::{Path, PathBuf},
};

use tauri::{Manager, Runtime};

use crate::entities::{app::SapphireAppConfig, file::FileData};

#[tauri::command]
pub fn get_file<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<FileData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or_else(|| "Cannot retrive app state")?;
    let vault_dir_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or_else(|| "Path to vault is not set")?;
    let vault_dir_path = Path::new(&vault_dir_path_string);
    let file_path = vault_dir_path.join(&path);

    let relative_file_path = file_path
        .strip_prefix(&vault_dir_path)
        .map_err(|_| "Cannot strip path")?;

    let relative_file_path_string = relative_file_path
        .to_path_buf()
        .into_os_string()
        .into_string()
        .map_err(|_| "Cannot convert path to string")?;

    let file_content =
        read_to_string(&file_path).map_err(|_| "Cannot read file content")?;

    let file_name = file_path
        .file_name()
        .ok_or_else(|| "Cannot get file name")?
        .to_os_string()
        .into_string()
        .map_err(|_| "Cannot convert path to string")?;

    return Ok(FileData {
        vault_name: vault_dir_path
            .file_name()
            .ok_or_else(|| "Cannoy access vault name")?
            .to_os_string()
            .into_string()
            .map_err(|_| "Cannot convert path to string")?,
        path: relative_file_path_string,
        name: file_name,
        content: file_content,
    });
}
