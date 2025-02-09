use crate::entities::{
    directory::DirectoryData,
    file::{self, FileData},
    repository::RepositoryStruct,
};
use serde::de::EnumAccess;
use std::{
    arch::x86_64::_mm_test_mix_ones_zeros,
    fs::{exists, read_dir, read_to_string},
    os,
    path::{Path, PathBuf},
    thread::panicking,
};
use tauri::{command, Runtime};

#[tauri::command]
pub fn get_top_level_repository_all(
    path: String,
) -> Result<Vec<RepositoryStruct>, String> {
    let top_level_dir_path = Path::new(&path);

    let mut items: Vec<RepositoryStruct> = Vec::new();
    match read_dir(top_level_dir_path) {
        Ok(entries) => {
            for entry_result in entries {
                match entry_result {
                    Ok(entry) => {
                        let path = entry.path();
                        match path.is_dir() {
                            true => {
                                let config_file_path =
                                    path.join(".sapphire.config");
                                match exists(config_file_path) {
                                    Ok(config_file_exists) => {
                                        match config_file_exists {
                                            true => match path
                                                .into_os_string()
                                                .into_string()
                                            {
                                                Ok(os_str) => {
                                                    items.push(RepositoryStruct {name:entry.file_name().into_string().expect("Cannot convert file name to string"),path:entry.path().into_os_string().into_string().expect("Cannot convert path to string") }) 
                                                }
                                                Err(_) => (),
                                            },
                                            false => (),
                                        }
                                    }
                                    Err(_) => (),
                                }
                            }
                            false => (),
                        }
                    }
                    Err(_) => (),
                }
            }
        }
        Err(_) => (),
    };

    Ok(items)
}

#[tauri::command]
pub fn get_repository(path: String) -> Result<DirectoryData, String> {
    let repository_path = Path::new(&path);
    let mut files: Vec<String> = Vec::new();
    let mut directories: Vec<String> = Vec::new();

    for entry_result in read_dir(repository_path).expect("Cannot read dir") {
        match entry_result {
            Ok(entry) => {
                let path = entry.path();
                if path.is_dir() {
                    directories.push(
                        entry
                            .path()
                            .into_os_string()
                            .into_string()
                            .expect("Cannot convert path to string"),
                    );
                } else if path.is_file() {
                    files.push(
                        entry
                            .path()
                            .into_os_string()
                            .into_string()
                            .expect("Cannot convert PathBuf to String"),
                    );
                }
            }
            Err(_) => continue,
        }
    }
    Ok(DirectoryData {
        path,
        files,
        directories,
    })
}

#[tauri::command]
pub fn get_file(path: String) -> Result<FileData, String> {
    let file_path = Path::new(&path);

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
