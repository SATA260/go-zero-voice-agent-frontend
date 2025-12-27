import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import { setupAxiosInterceptors } from './utils/axios-interceptor'

import './styles/tailwind-output.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

// 必须先初始化 Pinia，然后才能配置 axios 拦截器（因为拦截器依赖 store）
app.use(createPinia())

// 配置全局 axios 拦截器
setupAxiosInterceptors(axios)

app.use(router)
app.use(ElementPlus)

// Register Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
