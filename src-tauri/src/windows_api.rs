use serde::Serialize;

/// 音频输入设备结构体
#[derive(Debug, Serialize)]
pub struct AudioInputDevice {
    /// 设备ID
    pub id: String,
    /// 设备友好名称
    pub name: String,
    /// 是否为默认设备
    pub is_default: bool,
}

/// 系统信息结构体
#[derive(Debug, Serialize)]
pub struct SystemInfo {
    /// CPU 名称
    pub cpu_name: String,
    /// 总物理内存 (字节)
    pub total_physical_bytes: u64,
    /// 可用物理内存 (字节)
    pub available_physical_bytes: u64,
    /// 系统盘总空间 (字节)
    pub system_drive_total_bytes: u64,
    /// 系统盘可用空间 (字节)
    pub system_drive_free_bytes: u64,
}

#[cfg(target_os = "windows")]
mod platform {
    use std::{ffi::c_void, os::windows::ffi::OsStrExt, ptr};

    use anyhow::{anyhow, bail, Context, Result};
    use scopeguard::guard;
    use windows::{
        core::{PCWSTR, PWSTR},
        Win32::{
            Foundation::{BOOL, E_INVALIDARG, HANDLE, HWND},
            Media::Audio::{
                eCapture, eConsole, eRender, DEVICE_STATE_ACTIVE, IAudioEndpointVolume, IMMDevice, IMMDeviceEnumerator,
                MMDeviceEnumerator,
            },
            Storage::FileSystem::GetDiskFreeSpaceExW,
            System::{
                Com::{CoCreateInstance, CoInitializeEx, CoTaskMemFree, CoUninitialize, CLSCTX_ALL, COINIT_MULTITHREADED},
                Com::StructuredStorage::{PROPVARIANT, STGM_READ},
                DataExchange::{CloseClipboard, EmptyClipboard, GetClipboardData, OpenClipboard, SetClipboardData, CF_UNICODETEXT},
                Memory::{GlobalAlloc, GlobalFree, GlobalLock, GlobalUnlock, GMEM_MOVEABLE},
                Registry::{RegGetValueW, HKEY_LOCAL_MACHINE, RRF_RT_REG_SZ},
                SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX},
                Variant::PropVariantClear,
            },
            UI::{
                Shell::{PropertiesSystem::{IPropertyStore, PKEY_Device_FriendlyName, PropVariantToStringAlloc}, ShellExecuteW},
                WindowsAndMessaging::SW_SHOWNORMAL,
            },
        },
    };

    use super::{AudioInputDevice, SystemInfo};

    /// COM 初始化守卫，用于自动调用 CoUninitialize
    struct ComGuard(bool);
    impl Drop for ComGuard {
        fn drop(&mut self) {
            if self.0 {
                unsafe { CoUninitialize(); }
            }
        }
    }

    /// 将 Rust 字符串转换为 Windows 宽字符字符串 (UTF-16)
    fn to_pcwstr(text: &str) -> Vec<u16> {
        std::ffi::OsStr::new(text)
            .encode_wide()
            .chain(std::iter::once(0))
            .collect()
    }

    /// 获取剪贴板文本内容
    pub fn get_clipboard_text() -> Result<String> {
        unsafe {
            // 打开剪贴板
            if !OpenClipboard(HWND(0)).as_bool() {
                bail!("OpenClipboard failed");
            }
            // 确保在作用域结束时关闭剪贴板
            let _close = guard((), |_| {
                let _ = CloseClipboard();
            });

            // 获取剪贴板数据句柄
            let handle: HANDLE = GetClipboardData(CF_UNICODETEXT);
            if handle.0 == 0 {
                bail!("GetClipboardData returned null");
            }

            // 锁定全局内存以获取指针
            let ptr = GlobalLock(handle);
            if ptr.is_null() {
                bail!("GlobalLock failed");
            }
            // 确保在作用域结束时解锁全局内存
            let _unlock = guard((), |_| {
                let _ = GlobalUnlock(handle);
            });

            // 将指针转换为宽字符串并转换为 Rust String
            let wide = PWSTR(ptr as *mut u16);
            let text = wide.to_string().context("failed to decode clipboard text")?;
            Ok(text)
        }
    }

    /// 设置剪贴板文本内容
    pub fn set_clipboard_text(text: &str) -> Result<()> {
        unsafe {
            // 打开剪贴板
            if !OpenClipboard(HWND(0)).as_bool() {
                bail!("OpenClipboard failed");
            }
            // 确保在作用域结束时关闭剪贴板
            let _close = guard((), |_| {
                let _ = CloseClipboard();
            });

            // 清空剪贴板
            EmptyClipboard();

            // 将文本转换为 UTF-16 编码
            let wide: Vec<u16> = text.encode_utf16().chain(std::iter::once(0)).collect();
            let size_bytes = wide.len() * std::mem::size_of::<u16>();
            
            // 分配全局内存
            let hglobal = GlobalAlloc(GMEM_MOVEABLE, size_bytes);
            if hglobal.0.is_null() {
                bail!("GlobalAlloc failed");
            }

            // 锁定全局内存以获取指针
            let dest = GlobalLock(hglobal);
            if dest.is_null() {
                let _ = GlobalFree(hglobal);
                bail!("GlobalLock failed");
            }

            // 将数据复制到全局内存
            ptr::copy_nonoverlapping(wide.as_ptr() as *const c_void, dest, size_bytes);
            GlobalUnlock(hglobal);

            // 设置剪贴板数据
            let set_res = SetClipboardData(CF_UNICODETEXT, hglobal);
            if set_res.is_invalid() {
                let _ = GlobalFree(hglobal);
                bail!("SetClipboardData failed");
            }
            Ok(())
        }
    }

    /// 获取设备 ID
    unsafe fn device_id(device: &IMMDevice) -> Result<String> {
        let raw = device.GetId()?;
        raw.to_string().context("unable to read device id")
    }

    /// 获取设备友好名称
    unsafe fn device_friendly_name(device: &IMMDevice) -> Result<String> {
        let store: IPropertyStore = device
            .OpenPropertyStore(STGM_READ)
            .context("failed to open property store")?;

        let mut prop = PROPVARIANT::default();
        store
            .GetValue(&PKEY_Device_FriendlyName, &mut prop)
            .context("failed to read friendly name")?;

        let mut wide: PWSTR = PWSTR::null();
        PropVariantToStringAlloc(&prop, &mut wide)
            .ok()
            .map_err(|e| anyhow!("PropVariantToStringAlloc failed: {e}"))?;

        let name = wide
            .to_string()
            .context("failed to convert friendly name to string")?;

        CoTaskMemFree(Some(wide.0 as _));
        PropVariantClear(&mut prop).ok();

        Ok(name)
    }

    /// 获取默认捕获设备的 ID
    unsafe fn default_capture_id(enumerator: &IMMDeviceEnumerator) -> Result<Option<String>> {
        match enumerator.GetDefaultAudioEndpoint(eCapture, eConsole) {
            Ok(dev) => device_id(&dev).map(Some),
            Err(err) if err.code() == E_INVALIDARG => Ok(None),
            Err(err) => Err(anyhow!("GetDefaultAudioEndpoint failed: {err}")),
        }
    }

    /// 列出所有音频输入设备
    pub fn list_audio_input_devices() -> Result<Vec<AudioInputDevice>> {
        unsafe {
            // 初始化 COM
            let coinit = CoInitializeEx(None, COINIT_MULTITHREADED);
            let guard = ComGuard(coinit.is_ok());
            let _ = guard;

            // 创建设备枚举器
            let enumerator: IMMDeviceEnumerator =
                CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)
                    .context("failed to create MMDeviceEnumerator")?;

            // 获取默认设备 ID
            let default_id = default_capture_id(&enumerator)?;

            // 枚举活动的捕获端点
            let collection = enumerator
                .EnumAudioEndpoints(eCapture, DEVICE_STATE_ACTIVE)
                .context("failed to enumerate audio endpoints")?;

            let count = collection.GetCount()?;
            let mut devices = Vec::with_capacity(count as usize);
            for index in 0..count {
                let device = collection
                    .Item(index)
                    .with_context(|| format!("failed to fetch device at index {index}"))?;
                let id = device_id(&device)?;
                let name = device_friendly_name(&device)?;
                let is_default = default_id.as_ref().map(|d| d == &id).unwrap_or(false);
                devices.push(AudioInputDevice { id, name, is_default });
            }

            Ok(devices)
        }
    }

    /// 获取音频端点音量接口
    fn endpoint_volume() -> Result<IAudioEndpointVolume> {
        use windows::Win32::{
            Media::Audio::{eConsole, eRender, IMMDeviceEnumerator, MMDeviceEnumerator},
            System::Com::{CoCreateInstance, CoInitializeEx, CLSCTX_ALL, COINIT_MULTITHREADED},
        };
        unsafe {
            let _ = CoInitializeEx(None, COINIT_MULTITHREADED);
            let enumerator: IMMDeviceEnumerator =
                CoCreateInstance(&MMDeviceEnumerator, None, CLSCTX_ALL)
                    .context("failed to create MMDeviceEnumerator")?;

            let device = enumerator
                .GetDefaultAudioEndpoint(eRender, eConsole)
                .context("failed to get default render endpoint")?;

            let unk = device
                .Activate(&IAudioEndpointVolume::IID, CLSCTX_ALL, None)
                .context("failed to activate endpoint volume")?;

            let vol: IAudioEndpointVolume = unk.cast().context("cast to IAudioEndpointVolume failed")?;
            Ok(vol)
        }
    }

    /// 获取主音量 (0.0 - 1.0)
    pub fn get_master_volume() -> Result<f32> {
        let vol = endpoint_volume()?;
        unsafe {
            let mut level = 0.0f32;
            vol.GetMasterVolumeLevelScalar(&mut level)?;
            Ok(level)
        }
    }

    /// 设置主音量 (0.0 - 1.0)
    pub fn set_master_volume(level: f32) -> Result<()> {
        if !(0.0..=1.0).contains(&level) {
            bail!("volume must be between 0.0 and 1.0");
        }
        let vol = endpoint_volume()?;
        unsafe {
            vol.SetMasterVolumeLevelScalar(level, ptr::null())?;
        }
        Ok(())
    }

    /// 获取静音状态
    pub fn get_master_mute() -> Result<bool> {
        let vol = endpoint_volume()?;
        unsafe {
            let mut muted = BOOL(0);
            vol.GetMute(&mut muted)?;
            Ok(muted.as_bool())
        }
    }

    /// 设置静音状态
    pub fn set_master_mute(muted: bool) -> Result<()> {
        let vol = endpoint_volume()?;
        unsafe {
            vol.SetMute(muted, ptr::null())?;
        }
        Ok(())
    }

    /// 获取系统信息 (CPU, 内存, 磁盘)
    pub fn get_system_info() -> Result<SystemInfo> {
        use windows::Win32::{
            Storage::FileSystem::GetDiskFreeSpaceExW,
            System::{
                Registry::{RegGetValueW, HKEY_LOCAL_MACHINE, RRF_RT_REG_SZ},
                SystemInformation::{GlobalMemoryStatusEx, MEMORYSTATUSEX},
            },
        };

        unsafe {
            // 获取内存状态
            let mut mem = MEMORYSTATUSEX::default();
            mem.dwLength = std::mem::size_of::<MEMORYSTATUSEX>() as u32;
            GlobalMemoryStatusEx(&mut mem).context("GlobalMemoryStatusEx failed")?;

            // 获取 C 盘空间信息
            let drive = to_pcwstr("C:\\");
            let mut free = 0u64;
            let mut total = 0u64;
            GetDiskFreeSpaceExW(PCWSTR(drive.as_ptr()), Some(&mut free), Some(&mut total), None)
                .context("GetDiskFreeSpaceExW failed")?;

            // 从注册表获取 CPU 名称
            let cpu_name = {
                let path = to_pcwstr("HARDWARE\\DESCRIPTION\\System\\CentralProcessor\\0");
                let value = to_pcwstr("ProcessorNameString");
                let mut buf: [u16; 256] = [0; 256];
                let mut size: u32 = (buf.len() * std::mem::size_of::<u16>()) as u32;
                RegGetValueW(
                    HKEY_LOCAL_MACHINE,
                    PCWSTR(path.as_ptr()),
                    PCWSTR(value.as_ptr()),
                    RRF_RT_REG_SZ,
                    None,
                    Some(buf.as_mut_ptr() as *mut c_void),
                    Some(&mut size),
                )
                .context("RegGetValueW for CPU name failed")?;

                let len = (size as usize / 2).saturating_sub(1);
                String::from_utf16(&buf[..len]).context("failed to decode CPU name")?
            };

            Ok(SystemInfo {
                cpu_name,
                total_physical_bytes: mem.ullTotalPhys,
                available_physical_bytes: mem.ullAvailPhys,
                system_drive_total_bytes: total,
                system_drive_free_bytes: free,
            })
        }
    }

    /// 打开文件、目录或 URL
    pub fn open_path_or_url(target: &str) -> Result<()> {
        use windows::Win32::{
            Foundation::HWND,
            UI::{Shell::ShellExecuteW, WindowsAndMessaging::SW_SHOWNORMAL},
        };

        let target_w = to_pcwstr(target);
        let op = to_pcwstr("open");
        unsafe {
            let result = ShellExecuteW(
                HWND(0),
                PCWSTR(op.as_ptr()),
                PCWSTR(target_w.as_ptr()),
                None,
                None,
                SW_SHOWNORMAL,
            );
            if (result.0 as isize) <= 32 {
                bail!("ShellExecuteW failed with code {}", result.0 as isize);
            }
        }
        Ok(())
    }
}

#[cfg(target_os = "windows")]
pub use platform::*;

#[cfg(not(target_os = "windows"))]
pub fn list_audio_input_devices() -> anyhow::Result<Vec<AudioInputDevice>> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn get_clipboard_text() -> anyhow::Result<String> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn set_clipboard_text(_: &str) -> anyhow::Result<()> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn get_master_volume() -> anyhow::Result<f32> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn set_master_volume(_: f32) -> anyhow::Result<()> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn get_master_mute() -> anyhow::Result<bool> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn set_master_mute(_: bool) -> anyhow::Result<()> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn get_system_info() -> anyhow::Result<SystemInfo> {
    Err(anyhow::anyhow!("Windows-only API"))
}

#[cfg(not(target_os = "windows"))]
pub fn open_path_or_url(_: &str) -> anyhow::Result<()> {
    Err(anyhow::anyhow!("Windows-only API"))
}
