import { defineStore } from 'pinia';
import { DefaultApi as LlmApi } from '@/api/llm/api/default-api';
import { Configuration } from '@/api/llm/configuration';
import type {
  ChatsessionListChatSession200ResponseSessionsInner,
  ChatmessageListChatMessageBySession200ResponseMessagesInner,
} from '@/api/llm/model';

const llmApi = new LlmApi(new Configuration({ basePath: '/api' }));

interface MsgHistoryState {
  sessions: ChatsessionListChatSession200ResponseSessionsInner[];
  currentSessionId: number | null;
  messages: ChatmessageListChatMessageBySession200ResponseMessagesInner[];
  loading: boolean;
  currentPage: number;
  hasMore: boolean;
}

export const useMsgHistoryStore = defineStore('msgHistory', {
  state: (): MsgHistoryState => ({
    sessions: [],
    currentSessionId: null,
    messages: [],
    loading: false,
    currentPage: 1,
    hasMore: true,
  }),

  getters: {
    currentSession: (state) => state.sessions.find(s => s.id === state.currentSessionId),
  },

  actions: {
    getUserId() {
      return 1; // TODO: Replace with actual user ID retrieval logic
    },

    async fetchSessions(reset = false) {
      const userId = this.getUserId();
      this.loading = true;

      if (reset) {
        this.currentPage = 1;
        this.hasMore = true;
      }

      try {
        const response = await llmApi.chatsessionListChatSession({
          pageQuery: {
            page: this.currentPage,
            pageSize: 5,
            orderBy: 'create_time desc'
          },
        }, userId);

        const newSessions = response.data.sessions || [];

        if (reset) {
          this.sessions = newSessions;
        } else {
          this.sessions = [...this.sessions, ...newSessions];
        }

        // 如果返回的数据少于5条，说明没有更多数据了
        this.hasMore = newSessions.length === 5;

      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadMoreSessions() {
      if (!this.hasMore || this.loading) {
        return;
      }
      this.currentPage += 1;
      await this.fetchSessions(false);
    },

    async fetchMessages(sessionId: number) {
      const userId = this.getUserId();
      this.loading = true;
      try {
        const response = await llmApi.chatmessageListChatMessageBySession({
          sessionId: sessionId,
          pageQuery: {
            page: 1,
            pageSize: 20,
            orderBy: 'create_time asc'
          },
        }, userId);
        this.messages = response.data.messages || [];
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      } finally {
        this.loading = false;
      }
    },

    async selectSession(sessionId: number) {
      this.currentSessionId = sessionId;
      await this.fetchMessages(sessionId);
    },

    async deleteSession(sessionId: number) {
      const userId = this.getUserId();
      try {
        await llmApi.chatsessionDeleteChatSession(sessionId, userId);
        this.sessions = this.sessions.filter(s => s.id !== sessionId);
        if (this.currentSessionId === sessionId) {
          this.currentSessionId = null;
          this.messages = [];
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    },

    async deleteMessage(messageId: number) {
      const userId = this.getUserId();
      try {
        await llmApi.chatmessageDeleteChatMessage(messageId, userId);
        this.messages = this.messages.filter(m => m.id !== messageId);
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    },

    clearMessages() {
      this.messages = [];
      this.currentSessionId = null;
    },

    addMessage(message: ChatmessageListChatMessageBySession200ResponseMessagesInner) {
      this.messages.push(message);
    }
  },
});
