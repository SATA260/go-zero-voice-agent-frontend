# Go-Zero Voice Agent Frontend

[![Vue 3](https://img.shields.io/badge/Vue-3.x-42b883.svg)](https://vuejs.org/)
[![Tauri](https://img.shields.io/badge/Tauri-2.x-24c8db.svg)](https://tauri.app/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38b2ac.svg)](https://tailwindcss.com/)

这是一个基于 **Tauri** 和 **Vue 3** 构建的桌面端语音助手应用前端项目。它集成了 **Live2D** 虚拟形象，支持实时语音对话（WebRTC）和文本交互，旨在为用户提供沉浸式的 AI 伴侣体验。

本项目是 Go-Zero Voice Agent 系统的前端部分，通常需要配合后端服务一起使用。

## ✨ 功能特性

- **Live2D 虚拟形象**
  - 集成 `pixi-live2d-display`，展示生动的 Live2D 模型（默认白猫角色）。
  - 支持多种表情交互（如爱心眼、生气、害羞等）。
  - 点击交互菜单：打招呼、设置、通话控制等。
  - 气泡对话显示。

- **实时语音通话**
  - 基于 WebRTC 的实时语音通信。
  - 支持静音/取消静音、挂断等通话控制。
  - 语音活动检测（VAD）与状态同步。

- **多模态交互**
  - 支持文本聊天与语音聊天无缝切换。
  - 实时显示 AI 回复内容。

- **现代化 UI/UX**
  - 使用 Element Plus 组件库。
  - Tailwind CSS 驱动的响应式布局。
  - 优雅的动画效果。

## 🛠️ 技术栈

- **核心框架**: [Vue 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vitejs.dev/)
- **桌面端框架**: [Tauri v2](https://tauri.app/) (Rust)
- **UI 组件库**: [Element Plus](https://element-plus.org/)
- **样式库**: [Tailwind CSS](https://tailwindcss.com/)
- **状态管理**: [Pinia](https://pinia.vuejs.org/)
- **Live2D 渲染**: [PixiJS](https://pixijs.com/) + [pixi-live2d-display](https://github.com/guansss/pixi-live2d-display)
- **API 客户端**: Axios + OpenAPI Generator

## 🚀 快速开始

### 环境要求

- Node.js (推荐 v20+)
- pnpm
- Rust (用于构建 Tauri 后端)
- 系统依赖 (Linux/macOS/Windows 对应的 Tauri 开发环境依赖)

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动 Web 前端开发服务器（浏览器模式）：

```bash
pnpm dev
```

启动 Tauri 桌面应用开发模式：

```bash
pnpm tauri dev
```

### 构建发布

构建生产环境的桌面应用安装包：

```bash
pnpm tauri build
```

构建纯 Web 前端资源：

```bash
pnpm build
```

## 📂 项目结构

```
├── public/              # 静态资源 (Live2D 模型, 音乐, Swagger JSON)
├── src/
│   ├── api/             # OpenAPI 生成的 API 客户端代码
│   ├── assets/          # 静态资源 (SVG, 图片)
│   ├── components/      # Vue 组件 (ChatBox, Live2dDisplay 等)
│   ├── layouts/         # 页面布局
│   ├── router/          # 路由配置
│   ├── services/        # 核心服务 (Live2D, WebRTC)
│   ├── stores/          # Pinia 状态管理
│   ├── styles/          # 全局样式 & Tailwind 配置
│   ├── views/           # 页面视图 (Home, VoiceChat)
│   ├── App.vue          # 根组件
│   └── main.ts          # 入口文件
├── src-tauri/           # Tauri Rust 后端代码
├── tailwind.config.js   # Tailwind CSS 配置
├── tauri.conf.json      # Tauri 配置文件
└── vite.config.ts       # Vite 配置
```

## 🔌 API 生成

本项目使用 OpenAPI Generator 根据后端提供的 Swagger/OpenAPI 文档自动生成 TypeScript API 客户端。

如果后端接口有更新，请更新 `public/swagger/` 下的 JSON 文件，然后运行：

```bash
pnpm api:gen
```

## ⚙️ 后端服务配置

在开发模式下 (`pnpm dev`)，Vite 配置了以下反向代理，默认连接到本地运行的后端服务：

- `/api/usercenter` -> `http://localhost:3081` (用户中心服务)
- `/api/llm` -> `http://localhost:3082` (LLM 服务)
- `/api/voice` -> `http://localhost:3083` (语音服务)
- `/api/rag` -> `http://localhost:3084` (RAG 服务)

请确保后端服务已启动并监听在相应的端口，或者修改 `vite.config.ts` 中的代理配置。

## 📝 配置

应用启动后，可以通过设置菜单配置后端 API 地址和其他参数。

## 📄 许可证

[MIT License](LICENSE)
