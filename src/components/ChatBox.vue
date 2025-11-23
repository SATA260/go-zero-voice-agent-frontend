<template>
  <div class="chat-box flex flex-col h-screen bg-[#fff5f7]">
    <!-- 顶部标题栏 -->
    <div
      class="h-16 px-6 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm z-10">
      <div class="flex items-center gap-3">
        <img src="@/assets/svg/cat-avatar.png" alt="ai-avatar" class="w-10 h-10 rounded-full border-pink-200 shadow-sm" />
        <div class="flex flex-col">
          <span class="font-bold text-gray-800 text-base">{{ aiName || '猫猫' }}</span>
          <span class="text-xs text-green-500 flex items-center gap-1.5 font-medium">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            在线
          </span>
        </div>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 max-h-full" ref="messagesContainer">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <img src="@/assets/svg/Cat-01.svg" alt="hello" class="w-80 mb-4" />
        <div class="text-lg">点击左侧live2d形象开始语音聊天</div>
      </div>
      <div v-for="msg in messages" :key="msg.id" class="flex w-full transition-all duration-300 ease-out"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- AI 头像 -->
        <div v-if="msg.role === 'ai'"
          class="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mr-3 flex-shrink-0 shadow-sm border-2 border-white">
          <span class="text-lg">🐱</span>
        </div>

        <!-- 气泡 -->
        <div
          class="max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm relative cursor-target whitespace-pre-wrap"
          :class="[
            msg.role === 'user'
              ? 'bg-[#a0c4ff] text-white rounded-br-none'
              : 'bg-white text-gray-700 rounded-bl-none border-2 border-pink-100',
          ]">
          {{ msg.content }}
        </div>

        <!-- 用户头像 -->
        <div v-if="msg.role === 'user'"
          class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center ml-3 flex-shrink-0 shadow-sm border-2 border-white">
          <span class="text-lg">🐰</span>
        </div>
      </div>
    </div>

    <!-- 底部输入/状态栏 -->
    <div class="p-4 backdrop-blur-sm border-t border-pink-100">
      <!-- 语音监听状态 -->
      <div v-if="webRTCService.webrtcConnected.value"
        class="flex items-center justify-center gap-3 bg-pink-50 rounded-3xl p-3 shadow-inner border border-pink-100 h-[58px]">
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
        </div>
        <span class="text-pink-500 font-medium text-sm">正在聆听中...</span>
        <div class="flex items-center gap-1">
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          <div class="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        </div>
      </div>

      <!-- 文本输入框 -->
      <div v-else
        class="flex items-end gap-2 bg-white rounded-3xl p-2 shadow-sm border border-pink-100 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all duration-300">

        <el-input v-model="textarea" :autosize="{ minRows: 2, maxRows: 4 }" type="textarea" placeholder="输入消息..."
          class="flex-1 !border-none !shadow-none custom-textarea" resize="none" @keydown.enter="handleEnter" />
        <el-button type="primary" circle
          class="!w-10 !h-10 !bg-pink-400 !border-pink-400 hover:!bg-pink-500 hover:!border-pink-500 shadow-md mb-0.5"
          @click="sendMessage">
          <el-icon class="text-white text-lg">
            <Promotion />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted } from 'vue'
import { Promotion } from '@element-plus/icons-vue'
import { webRTCService } from '@/services/webrtcService'

defineProps<{
  aiName?: string
}>()

const textarea = ref('')

export interface Message {
  id: number
  role: 'user' | 'ai'
  content: string
}

const emit = defineEmits<{
  (e: 'ai-message', content: string): void
}>()

// 示例数据
const messages = ref<Message[]>([])

const messagesContainer = ref<HTMLElement | null>(null)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const handleEnter = (e: KeyboardEvent) => {
  if (!e.shiftKey) {
    e.preventDefault()
    sendMessage()
  }
}

const sendMessage = () => {
  if (!textarea.value.trim()) return

  messages.value.push({
    id: Date.now(),
    role: 'user',
    content: textarea.value
  })

  textarea.value = ''
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

/* 自定义输入框样式覆盖 */
:deep(.custom-textarea .el-textarea__inner) {
  box-shadow: none !important;
  background-color: transparent !important;
  padding: 8px 12px;
  border: none !important;
}

:deep(.custom-textarea .el-textarea__inner:focus) {
  box-shadow: none !important;
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
