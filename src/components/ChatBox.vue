<template>
  <div class="chat-box flex flex-col h-full bg-[#fff5f7]">
    <!-- 消息列表区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6" ref="messagesContainer">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="flex w-full transition-all duration-300 ease-out"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- AI 头像 -->
        <div
          v-if="msg.role === 'ai'"
          class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm border-2 border-white"
        >
          <span class="text-lg">🐱</span>
        </div>

        <!-- 气泡 -->
        <div
          class="max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative cursor-target"
          :class="[
            msg.role === 'user'
              ? 'bg-[#a0c4ff] text-white rounded-br-none'
              : 'bg-white text-gray-700 rounded-bl-none border-2 border-pink-100',
          ]"
        >
          {{ msg.content }}
        </div>

        <!-- 用户头像 -->
        <div
          v-if="msg.role === 'user'"
          class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3 flex-shrink-0 shadow-sm border-2 border-white"
        >
          <span class="text-lg">🐰</span>
        </div>
      </div>
    </div>

    <!-- 底部输入/状态栏 (示例) -->
    <div class="p-4 bg-white/80 backdrop-blur-sm border-t border-pink-100">
      <div
        class="flex items-center gap-2 text-pink-400 text-sm justify-center bg-pink-50 py-2 rounded-full"
      >
        <span class="animate-pulse">✨</span>
        <span>正在聆听...</span>
        <span class="animate-pulse">✨</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'

export interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
}

const emit = defineEmits<{
  (e: 'ai-message', content: string): void
}>()

// 示例数据
const messages = ref<Message[]>([
  { id: 1, role: 'ai', content: '你好！我是你的智能语音助手。' },
  { id: 2, role: 'user', content: '你好，今天天气怎么样？' },
  { id: 3, role: 'ai', content: '今天天气晴朗，气温 25 度，非常适合出去走走哦！' },
  { id: 4, role: 'user', content: '那太好了，帮我推荐几首适合散步听的歌吧。' },
  { id: 5, role: 'ai', content: '没问题，为你推荐《Summer》、《起风了》和《稻香》。' },
])

const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(
  () => messages.value.length,
  () => {
    scrollToBottom()
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'ai') {
      emit('ai-message', lastMsg.content)
    }
  },
)
</script>

<style scoped>
.chat-box {
  /* 确保在父容器中能正确撑开 */
  min-height: 0;
}

/* 滚动条美化 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
