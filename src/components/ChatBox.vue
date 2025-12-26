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
          <div v-if="hasToolCalls(msg)" class="mb-3 space-y-2">
            <div class="flex items-center justify-between text-xs text-gray-600">
              <div class="flex items-center gap-1 font-medium">
                <el-icon size="14"><Tools /></el-icon>
                <span>工具调用</span>
              </div>
              <div v-if="pendingCount(msg) > 1" class="flex gap-2">
                <el-button size="small" plain type="success" @click="bulkHandle(msg, 'confirm')"
                  :disabled="pendingCount(msg) === 0 || handlingTool">
                  全部接受
                </el-button>
                <el-button size="small" plain type="danger" @click="bulkHandle(msg, 'reject')"
                  :disabled="pendingCount(msg) === 0 || handlingTool">
                  全部拒绝
                </el-button>
              </div>
            </div>

            <div v-for="(tool, tIndex) in toolCallsFor(msg)" :key="tIndex"
              class="rounded-xl border border-pink-100 bg-pink-50/70 px-3 py-2 text-xs text-gray-700 shadow-inner">
              <div class="flex items-center justify-between gap-2">
                <div class="font-semibold text-gray-800 truncate">{{ tool.info?.name || '未知工具' }}</div>
                <el-tag size="small" round :type="statusType(tool)">{{ statusLabel(tool) }}</el-tag>
              </div>

              <!-- 工具描述 -->
              <div v-if="tool.info?.description" class="mt-1 text-[11px] leading-snug text-gray-500 italic">
                {{ tool.info.description }}
              </div>

              <div v-if="tool.info?.requiresConfirmation || tool.info?.scope === CLIENT_SCOPE" class="mt-2 flex gap-2">
                <el-button size="small" type="success" plain :disabled="!isPending(tool) || handlingTool"
                  @click="handleSingle(msg, tool, 'confirm')">确认</el-button>
                <el-button size="small" type="danger" plain :disabled="!isPending(tool) || handlingTool"
                  @click="handleSingle(msg, tool, 'reject')">拒绝</el-button>
              </div>

              <!-- 工具结果，支持展开/收起 -->
              <div v-if="tool.result" class="mt-1 text-[11px] text-green-600">
                <div
                  :class="[
                    'break-all',
                    !isToolExpanded(msg, tIndex) && toolResultNeedsExpand(tool) ? 'line-clamp-3' : ''
                  ]">
                  结果：{{ tool.result }}
                </div>
                <button
                  v-if="toolResultNeedsExpand(tool)"
                  @click="toggleToolExpand(msg, tIndex)"
                  class="text-pink-500 hover:text-pink-600 mt-1 underline">
                  {{ isToolExpanded(msg, tIndex) ? '收起' : '展开' }}
                </button>
              </div>

              <!-- 工具错误，支持展开/收起 -->
              <div v-if="tool.error" class="mt-1 text-[11px] text-red-500">
                <div
                  :class="[
                    'break-all',
                    !isToolExpanded(msg, tIndex) && toolErrorNeedsExpand(tool) ? 'line-clamp-3' : ''
                  ]">
                  错误：{{ tool.error }}
                </div>
                <button
                  v-if="toolErrorNeedsExpand(tool)"
                  @click="toggleToolExpand(msg, tIndex)"
                  class="text-pink-500 hover:text-pink-600 mt-1 underline">
                  {{ isToolExpanded(msg, tIndex) ? '收起' : '展开' }}
                </button>
              </div>
            </div>
          </div>
          <div>{{ msg.content }}</div>
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
          class="flex-1 !border-none !shadow-none custom-textarea" resize="none" @keydown.enter="handleEnter"
          :disabled="sending" />
        <el-button type="primary" circle
          class="!w-10 !h-10 !bg-pink-400 !border-pink-400 hover:!bg-pink-500 hover:!border-pink-500 shadow-md mb-0.5"
          @click="sendMessage" :loading="sending" :disabled="sending">
          <el-icon class="text-white text-lg" v-if="!sending">
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
<<<<<<< HEAD
import { Promotion, Collection, Document, Tools } from '@element-plus/icons-vue'
import { webRTCService, type llmChatMsg } from '@/services/webrtcService'
import { useMsgHistoryStore } from '@/stores/modules/msgHistory'
import { useRagStore } from '@/stores/modules/rag'
import { useChatStore } from '@/stores/modules/chat'
import { storeToRefs } from 'pinia'
import type {
  ChatmessageListChatMessageBySession200ResponseMessagesInner,
  ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInner,
  ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInnerInfo,
} from '@/api/llm/model'
=======
import { Promotion } from '@element-plus/icons-vue'
import { webRTCService } from '@/services/webrtcService'
import { useMsgHistoryStore } from '@/stores/modules/msgHistory'
import { storeToRefs } from 'pinia'
>>>>>>> 99277053c4a27964f631dcd7ef16adb410b9c2b2

defineProps<{
  aiName?: string
}>()

const chatStore = useChatStore()
const { sending } = storeToRefs(chatStore)

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
<<<<<<< HEAD
type UiMessage =
  | ChatmessageListChatMessageBySession200ResponseMessagesInner
  | (llmChatMsg & {
      toolCalls?: ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInner[]
      toolCallId?: string
      id?: number
      sessionId?: number
      createTime?: number
      extra?: string
    })

type ToolCall = ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInner & {
  info?: ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInnerInfo & { description?: string }
}

const messages = computed<UiMessage[]>(() => {
  if (currentSessionId.value || historyMessages.value.length > 0) {
    return historyMessages.value as UiMessage[]
  }
  return webRTCService.chatMessages.value as UiMessage[]
=======
const messages = computed(() => {
  if (currentSessionId.value) {
    return historyMessages.value
  }
  return webRTCService.chatMessages.value
>>>>>>> 99277053c4a27964f631dcd7ef16adb410b9c2b2
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
    if (!sending.value) {
      sendMessage()
    }
  }
}

// ------ 工具调用确认逻辑 ------
const CLIENT_SCOPE = 'client'
const PENDING_STATUSES = ['tool_calling_start', 'tool_calling_waiting_confirmation']

// 展开状态管理：使用 Map 存储每个消息中每个工具的展开状态
const toolExpandStates = ref<Map<string, Set<number>>>(new Map())

const getToolExpandKey = (msg: UiMessage) => {
  return `${msg.id || msg.createTime || JSON.stringify(msg)}`
}

const isToolExpanded = (msg: UiMessage, toolIndex: number) => {
  const key = getToolExpandKey(msg)
  return toolExpandStates.value.get(key)?.has(toolIndex) || false
}

const toggleToolExpand = (msg: UiMessage, toolIndex: number) => {
  const key = getToolExpandKey(msg)
  if (!toolExpandStates.value.has(key)) {
    toolExpandStates.value.set(key, new Set())
  }
  const expandSet = toolExpandStates.value.get(key)!
  if (expandSet.has(toolIndex)) {
    expandSet.delete(toolIndex)
  } else {
    expandSet.add(toolIndex)
  }
}

const toolResultNeedsExpand = (tool: ToolCall) => {
  const result = tool.result || ''
  // 判断结果是否超过3行（大约150个字符）
  return result.length > 150
}

const toolErrorNeedsExpand = (tool: ToolCall) => {
  const error = tool.error || ''
  // 判断错误信息是否超过3行（大约150个字符）
  return error.length > 150
}

const hasToolCalls = (msg: UiMessage) => {
  return Array.isArray((msg as any).toolCalls) && (msg as any).toolCalls.length > 0
}

const toolCallsFor = (msg: UiMessage) => {
  return ((msg as any).toolCalls || []) as ToolCall[]
}

const isPending = (tool: ToolCall) => {
  return PENDING_STATUSES.includes(tool.status)
}

const pendingCount = (msg: UiMessage) => {
  return toolCallsFor(msg).filter((t) => isPending(t)).length
}

const statusLabel = (tool: ToolCall) => {
  switch (tool.status) {
    case 'tool_calling_start':
      return '待处理'
    case 'tool_calling_waiting_confirmation':
      return '待确认'
    case 'tool_calling_confirmed':
      return '已确认'
    case 'tool_calling_rejected':
      return '已拒绝'
    case 'tool_calling_executing':
      return '执行中'
    case 'tool_calling_finished':
      return '已完成'
    case 'tool_calling_failed':
      return '失败'
    default:
      return tool.status || '未知'
  }
}

const statusType = (tool: ToolCall) => {
  switch (tool.status) {
    case 'tool_calling_confirmed':
    case 'tool_calling_finished':
      return 'success'
    case 'tool_calling_rejected':
    case 'tool_calling_failed':
      return 'danger'
    case 'tool_calling_executing':
      return 'warning'
    default:
      return 'info'
  }
}

const handlingTool = ref(false)

const executeClientTool = async (tool: ToolCall) => {
  // Placeholder for real client-side tool execution
  return `客户端已确认执行 ${tool.info?.name || ''}，暂未实现具体逻辑`
}

const applyLocalToolUpdates = (
  msg: UiMessage,
  updatedTools: ToolCall[],
) => {
  const clonedTools = updatedTools.map((t) => ({ ...t }))
  ;(msg as any).toolCalls = clonedTools

  const idx = msgHistoryStore.messages.findIndex((m) => m === msg)
  if (idx !== -1) {
    const existing = msgHistoryStore.messages[idx]
    if (!existing) return
    msgHistoryStore.messages.splice(idx, 1, {
      ...existing,
      content: existing.content || '',
      createTime: existing.createTime ?? Date.now(),
      toolCalls: clonedTools,
      toolCallId: msg.toolCallId || existing.toolCallId || '',
    })
  }
}

const sendToolDecision = async (
  msg: UiMessage,
  updatedTools: ToolCall[],
) => {
  handlingTool.value = true
  try {
    applyLocalToolUpdates(msg, updatedTools)
    await chatStore.sendToolCalls({
      toolCalls: updatedTools,
      toolCallId: msg.toolCallId || updatedTools[0]?.info?.id || '',
    })
  } finally {
    handlingTool.value = false
  }
}

const handleSingle = async (msg: UiMessage, tool: ToolCall, action: 'confirm' | 'reject') => {
  if (!isPending(tool)) return

  const updated = toolCallsFor(msg).map((t) => ({ ...t }))
  const target = updated.find((t) => t.info?.id === tool.info?.id)
  if (!target) return

  if (action === 'confirm') {
    target.status = tool.info?.scope === CLIENT_SCOPE ? 'tool_calling_finished' : 'tool_calling_confirmed'
    if (tool.info?.scope === CLIENT_SCOPE) {
      target.result = await executeClientTool(target)
    }
  } else {
    target.status = 'tool_calling_rejected'
  }

  await sendToolDecision(msg, updated)
}

const bulkHandle = async (msg: UiMessage, action: 'confirm' | 'reject') => {
  const updated = toolCallsFor(msg).map((t) => ({ ...t }))
  for (const t of updated) {
    if (!isPending(t)) continue
    if (action === 'confirm') {
      t.status = t.info?.scope === CLIENT_SCOPE ? 'tool_calling_finished' : 'tool_calling_confirmed'
      if (t.info?.scope === CLIENT_SCOPE) {
        t.result = await executeClientTool(t)
      }
    } else {
      t.status = 'tool_calling_rejected'
    }
  }

  await sendToolDecision(msg, updated)
}

const sendMessage = async () => {
  if (!textarea.value.trim()) return

  if (currentSessionId.value) {
    // 历史会话模式下暂不支持发送消息
    return
  }
<<<<<<< HEAD
=======

  webRTCService.chatMessages.value.push({
    role: 'user',
    content: textarea.value
  })
>>>>>>> 99277053c4a27964f631dcd7ef16adb410b9c2b2

  const content = textarea.value
  textarea.value = ''

  await chatStore.sendMessage(content)
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

/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
