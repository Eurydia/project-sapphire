mod commands;
mod entities;
mod services;
mod setup;
use crate::commands::create_vault_collection::create_vault_collection;
use crate::commands::get_directory::get_directory;
use crate::commands::get_file::get_file;
use crate::commands::get_vault::get_vault;
use crate::setup::setup_app_config;
use commands::*;
use tauri::Manager;

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
            get_file,
            get_directory,
            get_vault,
            open_directory,
            create_vault_collection,
            put_vault_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
