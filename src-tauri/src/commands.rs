use crate::entities::{
    app::SapphireAppConfig,
    directory::DirectoryData,
    file::{self, FileData},
    repository::RepositoryStruct,
};
use serde::de::EnumAccess;
use serde_json::map::Entry;
use std::{
    fs::{create_dir_all, exists, read_dir, read_to_string},
    os,
    path::{Path, PathBuf},
};
use tauri::{command, Manager, Runtime};

#[tauri::command]
pub fn get_top_level_repository_all<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
) -> Result<Vec<RepositoryStruct>, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .expect("App state is not defined");
    let vault_dir_path_string = app_config
        .get_base_dir()
        .expect("Path to the base vault should be set");
    let vault_dir_path = Path::new(&vault_dir_path_string);

    if !vault_dir_path
        .try_exists()
        .expect("Cannot check if vault path exists")
    {
        return Err(String::from("Configured vault dir does not exist"));
    }

    let entries = read_dir(vault_dir_path).expect("Cannot read vault dir");
    let mut repositories: Vec<RepositoryStruct> = Vec::new();
    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };
        let repository_path = entry.path();
        let config_file_path = repository_path.join(".sapphire.metadata");
        if repository_path.is_dir()
            && config_file_path
                .try_exists()
                .expect("Cannot check if repository metadata exists")
            && config_file_path.is_file()
        {
            let relative_repository_path = repository_path
                .strip_prefix(vault_dir_path)
                .expect("Repository path should have vault path as prefix");

            let relative_repository_path_string = relative_repository_path
                .to_path_buf()
                .into_os_string()
                .into_string()
                .expect("Cannot convert PathBuf into string");
            repositories.push(RepositoryStruct {
                name: relative_repository_path_string,
                path: relative_repository_path_string,
            })
        }
    }
    Ok(repositories)
}

#[tauri::command]
pub fn get_repository<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<DirectoryData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .expect("App state should be initialized");
    let vault_dir_path_string = app_config
        .get_base_dir()
        .expect("Path to the base vault should be set");
    let vault_dir_path = Path::new(&vault_dir_path_string);
    let repository_path = vault_dir_path.join(path);
    let mut files: Vec<String> = Vec::new();
    let mut directories: Vec<String> = Vec::new();

    let entries =
        read_dir(repository_path).expect("Cannot read repository path");

    for entry_result in entries {
        let Ok(entry) = entry_result else {
            continue;
        };

        let entry_path = entry.path();
        let relative_entry_path = entry_path
            .strip_prefix(vault_dir_path)
            .expect("Entry should have the vault dir path as suffix");
        if entry_path.is_dir() {
            directories.push(
                relative_entry_path
                    .into_os_string()
                    .into_string()
                    .expect("Cannot convert path to string"),
            )
        } else if entry_path.is_file() {
            files.push(
                relative_entry_path
                    .into_os_string()
                    .into_string()
                    .expect("Cannot convert path to string"),
            );
        }
    }
    return Ok(DirectoryData {
        path,
        files,
        directories,
    });
}

#[tauri::command]
pub fn get_file<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<FileData, String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .expect("App config should be set");
    let vault_dir_path_string = app_config
        .get_base_dir()
        .expect("Path to the base vault should be set");
    let vault_dir_path = Path::new(&vault_dir_path_string);
    let file_path = vault_dir_path.join(path);

    if !file_path.try_exists().expect("Target file should exist")
        || !file_path.is_file()
    {
        return Err(String::from(
            "File does not exist or provided a directory",
        ));
    }

    let file_name = file_path
        .file_name()
        .expect("Cannot get file name")
        .to_os_string()
        .into_string()
        .expect("Cannot convert path to string");
    let file_content =
        read_to_string(file_path).expect("Cannot read file content");
    Ok(FileData::new(path.to_string(), file_name, file_content))
}
