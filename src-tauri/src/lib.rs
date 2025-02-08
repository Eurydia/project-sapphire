use tauri::{AppHandle, Manager};

#[derive(Serialize, Deserialize, Debug)]
struct Config {
    setting: bool,
    username: String,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            setting: true,
            username: "default_user".to_string(),
        }
    }
}

fn create_config_if_not_exist( handler: &AppHandle) -> std::io::Result<Config> {
    let base_config_dir = handler.path().resolve("config.json", tauri::path::BaseDirectory::Config)
        .ok_or_else(|| std::io::Error::new(std::io::ErrorKind::NotFound, "Could not determine config directory"))?;
    
    let app_config_dir: PathBuf = base_config_dir.join("my_tauri_app");
    if !app_config_dir.exists() {
        fs::create_dir_all(&app_config_dir)?;
    }
    
    let config_file_path = app_config_dir.join("config.json");

    if !config_file_path.exists() {
        let config = Config::default();
        let config_json = serde_json::to_string_pretty(&config)
            .expect("Failed to serialize default configuration");
        
        let mut file = File::create(&config_file_path)?;
        file.write_all(config_json.as_bytes())?;
        println!("Created new config file at {:?}", config_file_path);
        Ok(config)
    } else {
        let content = fs::read_to_string(&config_file_path)?;
        let config: Config = serde_json::from_str(&content)
            .expect("Failed to parse the config file");
        Ok(config)
    }
}



#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| create_config_if_not_exist(app.app_handle()))
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
