use std::path::PathBuf;

use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use tauri::{App, Manager};
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup( |app: &mut App| {
 
            let handle = app.app_handle();


              tauri::async_runtime::spawn(async move {
            let name = if cfg!(dev) {
                "database/db.dev.sqlite"
            } else {
                "database/db.sqlite"
            };

           
            let path_resolver = handle.path();
            let path = path_resolver
                .resolve(name, tauri::path::BaseDirectory::AppConfig)
                .expect("resovle path failed")
                .to_str().expect("cant convert to str");

            let pool = SqlitePoolOptions::new()
                .max_connections(1)
                .connect(format!("sqlite://{}", path).as_str())
                .await
                .expect("cant create pool");

            sqlx::migrate!(".\\src\\database\\migrations")
                .run(&pool)
                .await
                .expect("migration failed");

            pool.close().await;
        });
        Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
