import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { useUserStore } from '@/stores/modules/user';

/**
 * 为axios实例配置请求拦截器，自动添加token到请求头
 */
export function setupAxiosInterceptors(axiosInstance: AxiosInstance = axios) {
  // 请求拦截器：自动添加token
  axiosInstance.interceptors.request.use(
    (config) => {
      const userStore = useUserStore();

      // 如果用户已登录且有token，添加到请求头
      if (userStore.token) {
        config.headers.Authorization = `Bearer ${userStore.token}`;
      }

      // 始终添加用户ID到header（硬编码为1）
      config.headers['X-User-Id'] = '1';

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器：处理401未授权错误
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // 如果返回401，说明token失效，清除登录状态
      if (error.response && error.response.status === 401) {
        const userStore = useUserStore();
        userStore.logout();

        // 可选：重定向到登录页
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
      }

      return Promise.reject(error);
    }
  );
}
