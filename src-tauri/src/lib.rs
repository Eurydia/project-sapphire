mod commands;
mod entities;
use crate::commands::{get_file, get_repository, get_top_level_repository_all};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_top_level_repository_all,
            get_file,
            get_repository
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
