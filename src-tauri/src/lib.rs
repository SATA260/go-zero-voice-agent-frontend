mod windows_api;

/// 列出音频输入设备
#[tauri::command]
async fn list_audio_input_devices() -> Result<Vec<windows_api::AudioInputDevice>, String> {
  windows_api::list_audio_input_devices().map_err(|e| e.to_string())
}

/// 获取剪贴板文本
#[tauri::command]
async fn get_clipboard_text() -> Result<String, String> {
  windows_api::get_clipboard_text().map_err(|e| e.to_string())
}

/// 设置剪贴板文本
#[tauri::command]
async fn set_clipboard_text(text: String) -> Result<(), String> {
  windows_api::set_clipboard_text(&text).map_err(|e| e.to_string())
}

/// 获取主音量
#[tauri::command]
async fn get_master_volume() -> Result<f32, String> {
  windows_api::get_master_volume().map_err(|e| e.to_string())
}

/// 设置主音量
#[tauri::command]
async fn set_master_volume(level: f32) -> Result<(), String> {
  windows_api::set_master_volume(level).map_err(|e| e.to_string())
}

/// 获取静音状态
#[tauri::command]
async fn get_master_mute() -> Result<bool, String> {
  windows_api::get_master_mute().map_err(|e| e.to_string())
}

/// 设置静音状态
#[tauri::command]
async fn set_master_mute(muted: bool) -> Result<(), String> {
  windows_api::set_master_mute(muted).map_err(|e| e.to_string())
}

/// 获取系统信息
#[tauri::command]
async fn get_system_info() -> Result<windows_api::SystemInfo, String> {
  windows_api::get_system_info().map_err(|e| e.to_string())
}

/// 打开文件、目录或 URL
#[tauri::command]
async fn open_path_or_url(target: String) -> Result<(), String> {
  windows_api::open_path_or_url(&target).map_err(|e| e.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .invoke_handler(tauri::generate_handler![
      list_audio_input_devices,
      get_clipboard_text,
      set_clipboard_text,
      get_master_volume,
      set_master_volume,
      get_master_mute,
      set_master_mute,
      get_system_info,
      open_path_or_url
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
