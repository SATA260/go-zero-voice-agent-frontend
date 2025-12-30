# Axios 拦截器配置说明

## 功能概述

已为所有 API 请求配置了全局 axios 拦截器，实现以下功能：

1. **自动添加 Token**：所有请求会自动在 `Authorization` header 中添加 `Bearer {token}`
2. **自动添加用户 ID**：所有请求会自动在 `X-User-Id` header 中添加用户 ID
3. **自动处理 401 错误**：当接收到 401 响应时，自动清除登录状态并重定向到登录页

## 实现文件

### 1. `/src/utils/axios-interceptor.ts`
拦截器核心逻辑文件，包含：
- 请求拦截器：自动添加 token 和 user-id
- 响应拦截器：处理 401 未授权错误

### 2. `/src/main.ts`
在应用启动时配置全局拦截器：
```typescript
import { setupAxiosInterceptors } from './utils/axios-interceptor'

// 必须先初始化 Pinia，然后才能配置 axios 拦截器
app.use(createPinia())
setupAxiosInterceptors(axios)
```

## 使用方法

### API 调用示例

配置拦截器后，API 调用变得更简洁：

**之前：**
```typescript
const response = await userApi.userDetail(`Bearer ${this.token}`);
```

**现在：**
```typescript
const response = await userApi.userDetail();
// token 会自动添加到请求头中
```

### 请求头示例

所有请求会自动包含以下 headers（如果用户已登录）：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-User-Id: 12345
```

## 影响的 API 服务

此配置影响所有使用全局 axios 实例的 API 服务：
- `/api/usercenter/*` - 用户中心 API
- `/api/voicechat/*` - 语音聊天 API
- `/api/llm/*` - LLM 配置 API
- `/api/rag/*` - RAG 文档管理 API

## 错误处理

### 401 未授权
当 API 返回 401 状态码时，拦截器会：
1. 调用 `userStore.logout()` 清除登录状态
2. 清除 localStorage 中的 token 和 userInfo
3. 重定向到 `/auth` 登录页面

## 注意事项

1. **Pinia 初始化顺序**：必须在配置拦截器之前初始化 Pinia，因为拦截器依赖 userStore
2. **Token 刷新**：当前实现不包含 token 自动刷新逻辑，需要单独实现
3. **公共 API**：即使没有 token，请求也会正常发送，只是不会包含 Authorization header

## 未来优化建议

1. 实现 token 刷新机制（使用 refreshToken）
2. 添加请求重试逻辑
3. 添加请求/响应日志（仅开发环境）
4. 支持请求取消（处理重复请求）
