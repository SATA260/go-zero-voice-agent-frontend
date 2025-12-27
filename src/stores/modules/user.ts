import { defineStore } from 'pinia';
import { DefaultApi } from '@/api/usercenter/api/default-api';
import { Configuration } from '@/api/usercenter/configuration';
import type { UserLoginRequest, UserRegisterRequest, UserSendCodeRequest } from '@/api/usercenter/model';
import type { UserDetail200ResponseUserInfo } from '@/api/usercenter/model';

const apiConfig = new Configuration({ basePath: '/api' });
const userApi = new DefaultApi(apiConfig);

interface UserState {
  token: string | null;
  userInfo: UserDetail200ResponseUserInfo | null;
  accessExpire: number | null;
  refreshAfter: number | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
    accessExpire: Number(localStorage.getItem('accessExpire')) || null,
    refreshAfter: Number(localStorage.getItem('refreshAfter')) || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    userId: (state) => state.userInfo?.id || null,
  },

  actions: {
    async sendCode(email: string) {
      try {
        const request: UserSendCodeRequest = { email };
        await userApi.userSendCode(request);
      } catch (error) {
        console.error('Failed to send code:', error);
        throw error;
      }
    },

    async register(email: string, code: string, password: string) {
      try {
        const request: UserRegisterRequest = { email, code, password };
        const response = await userApi.userRegister(request);

        if (response.data) {
          this.token = response.data.accessToken || null;
          this.accessExpire = response.data.accessExpire || null;
          this.refreshAfter = response.data.refreshAfter || null;

          if (this.token) {
            localStorage.setItem('token', this.token);
            if (this.accessExpire) {
              localStorage.setItem('accessExpire', this.accessExpire.toString());
            }
            if (this.refreshAfter) {
              localStorage.setItem('refreshAfter', this.refreshAfter.toString());
            }

            await this.fetchUserInfo();
          }
        }
      } catch (error) {
        console.error('Failed to register:', error);
        throw error;
      }
    },

    async login(email: string, password: string) {
      try {
        const request: UserLoginRequest = {
          mobile: email,
          password
        };
        const response = await userApi.userLogin(request);

        if (response.data) {
          this.token = response.data.accessToken || null;
          this.accessExpire = response.data.accessExpire || null;
          this.refreshAfter = response.data.refreshAfter || null;

          if (this.token) {
            localStorage.setItem('token', this.token);
            if (this.accessExpire) {
              localStorage.setItem('accessExpire', this.accessExpire.toString());
            }
            if (this.refreshAfter) {
              localStorage.setItem('refreshAfter', this.refreshAfter.toString());
            }

            await this.fetchUserInfo();
          }
        }
      } catch (error) {
        console.error('Failed to login:', error);
        throw error;
      }
    },

    async fetchUserInfo() {
      if (!this.token) return;

      try {
        const response = await userApi.userDetail(`Bearer ${this.token}`);
        if (response.data && response.data.userInfo) {
          this.userInfo = response.data.userInfo;
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        throw error;
      }
    },

    logout() {
      this.token = null;
      this.userInfo = null;
      this.accessExpire = null;
      this.refreshAfter = null;

      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('accessExpire');
      localStorage.removeItem('refreshAfter');
    },
  },
});
