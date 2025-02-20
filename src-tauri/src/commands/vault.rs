use tauri::{Manager, Runtime};

use crate::services::app_config::update_vault_path;

#[tauri::command]
pub async fn put_vault_dir<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<(), String> {
    let config_dir_path =
        app.path().config_dir().map_err(|err| err.to_string())?;
    let config_file_path = config_dir_path.join("config.json");

    return update_vault_path(&config_file_path, path);
}
