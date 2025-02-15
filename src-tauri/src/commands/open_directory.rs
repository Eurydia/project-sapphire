use std::path::Path;

use tauri::{Manager, Runtime};
use tauri_plugin_opener::{open_path, open_url};

use crate::entities::app::SapphireAppConfig;

#[tauri::command]
pub async fn open_directory<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    path: String,
) -> Result<(), String> {
    let app_config = app
        .try_state::<SapphireAppConfig>()
        .ok_or("Cannot access app state")?;
    let vault_path_string = app_config
        .base_dir
        .as_ref()
        .ok_or("Vault path is not set")?;
    let vault_path = Path::new(vault_path_string);
    let target_path = vault_path.join(path);
    open_path(target_path, None::<&str>).map_err(|_| "Cannot open path")?;
    return Ok(());
}
