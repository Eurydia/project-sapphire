use std::fs::{create_dir_all, exists, read_to_string, write};

use tauri::{
    utils::config::{self, AppConfig},
    App, Manager,
};

use crate::entities::app::SapphireAppConfig;

pub fn setup_app_config(app: &App) -> Result<SapphireAppConfig, String> {
    let config_dir_path = app
        .app_handle()
        .path()
        .app_config_dir()
        .expect("Cannot get config_dir path.");

    if (!config_dir_path
        .try_exists()
        .expect("Cannot check if config path exists"))
    {
        create_dir_all(&config_dir_path)
            .expect("Cannot create missing config_dir");
    }

    let config_file_path = config_dir_path.join("config.json");

    if (!config_file_path
        .try_exists()
        .expect("Casnnot check if config file exists"))
    {
        let default_app_config = SapphireAppConfig::default();
        let serialized_app_config =
            serde_json::to_string_pretty(&default_app_config)
                .expect("Cannot serialize default app config");

        write(&config_file_path, serialized_app_config)
            .expect("Cannot write serialized default app config");
        return Ok(default_app_config);
    }

    let app_config_string = read_to_string(config_file_path)
        .expect("Cannot read content from config file");
    let app_config: SapphireAppConfig =
        serde_json::from_str(&app_config_string)
            .expect("Cannot deserialize app config");
    return Ok(app_config);
}
