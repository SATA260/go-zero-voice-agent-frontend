<template>
  <div class="chat-box flex flex-col h-screen bg-[#fff5f7]">
    <!-- 顶部标题栏 -->
    <div
      class="h-16 px-6 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-pink-100 shadow-sm z-10">
      <div class="flex items-center gap-3">
        <img src="@/assets/svg/cat-avatar.png" alt="ai-avatar"
          class="w-10 h-10 rounded-full border-pink-200 shadow-sm" />
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

      <!-- RAG 按钮 -->
      <button
        class="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 border"
        :class="[
          selectedDocIds.length > 0
            ? 'bg-pink-50 text-pink-500 border-pink-200 shadow-sm hover:bg-pink-100'
            : 'bg-transparent text-gray-500 border-transparent hover:bg-white hover:text-pink-500 hover:border-pink-100 hover:shadow-sm'
        ]" @click="openRagDialog">
        <el-icon>
          <Collection />
        </el-icon>
        <span>知识库 {{ selectedDocIds.length > 0 ? `(${selectedDocIds.length})` : '' }}</span>
      </button>
    </div>

    <!-- 消息列表区域 -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 max-h-full" ref="messagesContainer">
      <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400">
        <img src="@/assets/svg/Cat-01.svg" alt="hello" class="w-80 mb-4" />
        <div class="text-lg">点击左侧live2d形象开始语音聊天</div>
      </div>
      <div v-for="(msg, index) in messages" :key="index" class="flex w-full transition-all duration-300 ease-out"
        :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
        <!-- AI 头像 -->
        <div v-if="msg.role === 'assistant'"
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
      <div v-if="webRTCService.websokcetConnected.value"
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
        class=" cursor-target flex items-end gap-2 bg-white rounded-3xl p-2 shadow-sm border border-pink-100 focus-within:border-pink-300 focus-within:ring-2 focus-within:ring-pink-100 transition-all duration-300">

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

    <!-- RAG 选择抽屉 -->
    <el-drawer v-model="showRagDialog" title="知识库选择" direction="rtl" size="400px" :with-header="true"
      class="rag-drawer">
      <div class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto px-1">
          <div v-if="documentList.length === 0" class="flex flex-col items-center justify-center h-64 text-gray-400">
            <el-icon size="48" class="mb-2 opacity-50">
              <Document />
            </el-icon>
            <p>暂无文档</p>
            <router-link to="/voice-chat/rag" class="text-pink-500 text-sm mt-2 hover:underline">去上传文档</router-link>
          </div>

          <div v-else class="space-y-3">
            <div v-for="doc in documentList" :key="doc.id"
              class="group relative flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md"
              :class="tempSelectedIds.includes(String(doc.id)) ? 'bg-pink-50 border-pink-200' : 'bg-white border-gray-100 hover:border-pink-100'"
              @click="toggleSelection(String(doc.id))">
              <!-- Checkbox -->
              <div class="pt-1" @click.stop>
                <el-checkbox v-model="tempSelectedIds" :label="String(doc.id)" size="large" class="!mr-0">
                  <span class="hidden"></span>
                </el-checkbox>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <h4 class="font-medium text-gray-800 truncate pr-2"
                    :class="{ 'text-pink-600': tempSelectedIds.includes(String(doc.id)) }">
                    {{ doc.fileName }}
                  </h4>
                  <el-tag size="small" effect="plain" round class="!bg-white !border-gray-200 text-xs">
                    {{ doc.fileFormat }}
                  </el-tag>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-500">
                  <span class="flex items-center gap-1">
                    <el-icon>
                      <Document />
                    </el-icon>
                    ID: {{ doc.id }}
                  </span>
                  <span v-if="doc.status === 1" class="text-green-500 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    已就绪
                  </span>
                  <span v-else class="text-orange-400 flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                    处理中
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="pt-4 mt-4 border-t border-gray-100 flex justify-between items-center bg-white">
          <span class="text-sm text-gray-500">已选 {{ tempSelectedIds.length }} 个文档</span>
          <div class="flex gap-3">
            <button class="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors text-sm"
              @click="showRagDialog = false">取消</button>
            <button
              class="px-6 py-2 rounded-lg bg-pink-500 text-white shadow-md hover:bg-pink-600 transition-colors text-sm font-medium"
              @click="confirmRagSelection">确认选择</button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, computed } from 'vue'
import { Promotion, Collection, Document } from '@element-plus/icons-vue'
import { webRTCService } from '@/services/webrtcService'
import { useMsgHistoryStore } from '@/stores/modules/msgHistory'
import { useRagStore } from '@/stores/modules/rag'
import { storeToRefs } from 'pinia'

defineProps<{
  aiName?: string
}>()

const ragStore = useRagStore()
const { documentList, selectedDocIds } = storeToRefs(ragStore)
const showRagDialog = ref(false)
const tempSelectedIds = ref<string[]>([])

const openRagDialog = async () => {
  if (documentList.value.length === 0) {
    await ragStore.fetchDocumentList()
  }
  tempSelectedIds.value = [...selectedDocIds.value]
  showRagDialog.value = true
}

const confirmRagSelection = () => {
  ragStore.setSelectedDocIds(tempSelectedIds.value)
  showRagDialog.value = false
}

const toggleSelection = (id: string) => {
  const index = tempSelectedIds.value.indexOf(id)
  if (index > -1) {
    tempSelectedIds.value.splice(index, 1)
  } else {
    tempSelectedIds.value.push(id)
  }
}

const textarea = ref('')

const emit = defineEmits<{
  (e: 'ai-message', content: string): void
}>()

const msgHistoryStore = useMsgHistoryStore()
const { messages: historyMessages, currentSessionId } = storeToRefs(msgHistoryStore)

// 消息列表
const messages = computed(() => {
  if (currentSessionId.value) {
    return historyMessages.value
  }
  return webRTCService.chatMessages.value
})

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

  if (currentSessionId.value) {
    // 历史会话模式下暂不支持发送消息
    return
  }

  webRTCService.chatMessages.value.push({
    role: 'user',
    content: textarea.value
  })

  textarea.value = ''
}

onMounted(() => {
  scrollToBottom()
})

watch(
  messages,
  () => {
    scrollToBottom()
    const lastMsg = messages.value[messages.value.length - 1]
    if (lastMsg && lastMsg.role === 'assistant') {
      emit('ai-message', lastMsg.content)
    }
  },
  { deep: true }
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
