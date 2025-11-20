import { defineStore } from 'pinia';
import { DefaultApi } from '@/api/voicechat/api/default-api';
import { Configuration } from '@/api/voicechat/configuration';
import { DefaultApi as LlmApi } from '@/api/llm/api/default-api';
import { Configuration as LlmConfiguration } from '@/api/llm/configuration';
import type {
  AsrListAsrConfig200ResponseConfigListInner,
  TtsListTtsConfig200ResponseConfigListInner,
  AsrCreateAsrConfigBody,
  TtsCreateTtsConfigBody,
  ChatStartRequestLlmConfig
} from '@/api/voicechat/model';
import type {
  ConfigListMyConfigRequestQueryFilter,
  ConfigCreateConfigBody
} from '@/api/llm/model';

// 初始化 API 实例
const apiConfig = new Configuration({ basePath: '/api' });
const voiceApi = new DefaultApi(apiConfig);

const llmApiConfig = new LlmConfiguration({ basePath: '/api' });
const llmApi = new LlmApi(llmApiConfig);

interface ApiSettingState {
  asrConfigs: AsrListAsrConfig200ResponseConfigListInner[];
  ttsConfigs: TtsListTtsConfig200ResponseConfigListInner[];
  llmConfigs: ConfigListMyConfigRequestQueryFilter[];
  currentAsrConfigId: number | null;
  currentTtsConfigId: number | null;
  currentLlmConfigId: number | null;
}

export const useApiSettingStore = defineStore('apiSetting', {
  state: (): ApiSettingState => ({
    asrConfigs: [],
    ttsConfigs: [],
    llmConfigs: [],
    currentAsrConfigId: Number(localStorage.getItem('currentAsrConfigId')) || null,
    currentTtsConfigId: Number(localStorage.getItem('currentTtsConfigId')) || null,
    currentLlmConfigId: Number(localStorage.getItem('currentLlmConfigId')) || null,
  }),

  getters: {
    currentAsrConfig: (state) => state.asrConfigs.find(c => c.id === state.currentAsrConfigId),
    currentTtsConfig: (state) => state.ttsConfigs.find(c => c.id === state.currentTtsConfigId),
    currentLlmConfig: (state) => state.llmConfigs.find(c => c.id === state.currentLlmConfigId),
    // 适配 ChatStartRequestLlmConfig 接口
    activeLlmConfig(): ChatStartRequestLlmConfig | null {
      const config = this.currentLlmConfig;
      if (!config) return null;
      return {
        apiBaseUrl: config.baseUrl,
        apiKey: config.apiKey,
        model: config.model,
      };
    }
  },

  actions: {
    getUserId() {
      return 1; // TODO: Replace with actual user ID retrieval logic
    },

    // --- ASR Actions ---

    async fetchAsrConfigs() {
      const userId = this.getUserId();
      if (!userId) return;

      try {
        const response = await voiceApi.asrListAsrConfig({ page: 1, pageSize: 100 }, userId);
        if (response.data && response.data.configList) {
          this.asrConfigs = response.data.configList;
          // 如果当前没有选中的配置，默认选中第一个
          if (!this.currentAsrConfigId && this.asrConfigs.length > 0) {
            const firstConfig = this.asrConfigs[0];
            if (firstConfig && firstConfig.id !== undefined) {
              this.setCurrentAsrConfigId(firstConfig.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch ASR configs:', error);
      }
    },

    async createAsrConfig(config: AsrCreateAsrConfigBody) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await voiceApi.asrCreateAsrConfig(config, userId);
        await this.fetchAsrConfigs(); // 重新获取列表
      } catch (error) {
        console.error('Failed to create ASR config:', error);
        throw error;
      }
    },

    async deleteAsrConfig(id: number) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await voiceApi.asrDeleteAsrConfig(id, userId);
        if (this.currentAsrConfigId === id) {
          this.currentAsrConfigId = null;
          localStorage.removeItem('currentAsrConfigId');
        }
        await this.fetchAsrConfigs();
      } catch (error) {
        console.error('Failed to delete ASR config:', error);
        throw error;
      }
    },

    setCurrentAsrConfigId(id: number) {
      this.currentAsrConfigId = id;
      localStorage.setItem('currentAsrConfigId', id.toString());
    },

    // --- TTS Actions ---

    async fetchTtsConfigs() {
      const userId = this.getUserId();
      if (!userId) return;

      try {
        const response = await voiceApi.ttsListTtsConfig({ page: 1, pageSize: 100 }, userId);
        if (response.data && response.data.configList) {
          this.ttsConfigs = response.data.configList;
          if (!this.currentTtsConfigId && this.ttsConfigs.length > 0) {
            const firstConfig = this.ttsConfigs[0];
            if (firstConfig && firstConfig.id !== undefined) {
              this.setCurrentTtsConfigId(firstConfig.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch TTS configs:', error);
      }
    },

    async createTtsConfig(config: TtsCreateTtsConfigBody) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await voiceApi.ttsCreateTtsConfig(config, userId);
        await this.fetchTtsConfigs();
      } catch (error) {
        console.error('Failed to create TTS config:', error);
        throw error;
      }
    },

    async deleteTtsConfig(id: number) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await voiceApi.ttsDeleteTtsConfig(id, userId);
        if (this.currentTtsConfigId === id) {
          this.currentTtsConfigId = null;
          localStorage.removeItem('currentTtsConfigId');
        }
        await this.fetchTtsConfigs();
      } catch (error) {
        console.error('Failed to delete TTS config:', error);
        throw error;
      }
    },

    setCurrentTtsConfigId(id: number) {
      this.currentTtsConfigId = id;
      localStorage.setItem('currentTtsConfigId', id.toString());
    },

    // --- LLM Actions ---

    async fetchLlmConfigs() {
      const userId = this.getUserId();
      if (!userId) return;

      try {
        const response = await llmApi.configListMyConfig({
          pageQuery: { page: 1, pageSize: 100, orderBy: 'id desc' },
          queryFilter: { userId } as unknown as ConfigListMyConfigRequestQueryFilter
        });
        if (response.data && response.data.configs) {
          this.llmConfigs = response.data.configs;
          if (!this.currentLlmConfigId && this.llmConfigs.length > 0) {
            const firstConfig = this.llmConfigs[0];
            if (firstConfig && firstConfig.id !== undefined) {
              this.setCurrentLlmConfigId(firstConfig.id);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch LLM configs:', error);
      }
    },

    async createLlmConfig(config: ConfigCreateConfigBody) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await llmApi.configCreateConfig(config);
        await this.fetchLlmConfigs();
      } catch (error) {
        console.error('Failed to create LLM config:', error);
        throw error;
      }
    },

    async deleteLlmConfig(id: number) {
      const userId = this.getUserId();
      if (!userId) throw new Error('User not logged in');

      try {
        await llmApi.configDeleteConfig(id);
        if (this.currentLlmConfigId === id) {
          this.currentLlmConfigId = null;
          localStorage.removeItem('currentLlmConfigId');
        }
        await this.fetchLlmConfigs();
      } catch (error) {
        console.error('Failed to delete LLM config:', error);
        throw error;
      }
    },

    setCurrentLlmConfigId(id: number) {
      this.currentLlmConfigId = id;
      localStorage.setItem('currentLlmConfigId', id.toString());
    }
  }
});
