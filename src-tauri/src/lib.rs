mod commands;
mod entities;
mod setup;
use setup::setup_app_config;
use tauri::Manager;

use crate::commands::{get_file, get_repository, get_top_level_repository_all};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_config =
                setup_app_config(app).expect("Cannot prepare app config");
            app.manage(app_config);
            return Ok(());
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_top_level_repository_all,
            get_file,
            get_repository
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
