import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiSettingStore } from '@/stores/modules/apiSetting'
import { useMsgHistoryStore } from '@/stores/modules/msgHistory'
import { useRagStore } from '@/stores/modules/rag'
import { ElMessage } from 'element-plus'
import type { ChatTextChatRequest, ChatmessageListChatMessageBySession200ResponseMessagesInner } from '@/api/llm/model'

export const useChatStore = defineStore('chat', () => {
  const apiSettingStore = useApiSettingStore()
  const msgHistoryStore = useMsgHistoryStore()
  const ragStore = useRagStore()

  const sending = ref(false)
  const conversationId = ref<string>('')

  const sendMessage = async (content: string) => {
    if (!content.trim() || sending.value) return

    const configId = apiSettingStore.currentLlmConfigId
    if (!configId) {
      ElMessage.warning('请先选择LLM配置')
      return
    }

    const userMsg: ChatmessageListChatMessageBySession200ResponseMessagesInner = {
      id: 0,
      sessionId: Number(conversationId.value) || 0,
      content,
      role: 'user',
      createTime: Date.now(),
      extra: '',
      toolCallId: '',
      toolCalls: []
    }
    msgHistoryStore.addMessage(userMsg)

    sending.value = true

    const payload: ChatTextChatRequest = {
      configId,
      message: content,
      isStream: true,
      conversationId: conversationId.value || undefined,
    }

    const ragIds = ragStore.selectedDocIds
      .map((id) => Number(id))
      .filter((num) => Number.isFinite(num))
    if (ragIds.length) {
      payload.ragFileIds = ragIds
    }

    console.log("payload", payload)

    try {
      const response = await fetch('/api/llm/v1/chat/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-User-Id': String(msgHistoryStore.getUserId())
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Readable stream not available')

      const decoder = new TextDecoder()
      let buffer: ChatmessageListChatMessageBySession200ResponseMessagesInner | null = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        let jsonStr = decoder.decode(value, { stream: true })
        if (!jsonStr) continue

        try {
          console.log('Received chunk:', jsonStr)
          if (jsonStr.startsWith('data: ')) {
            jsonStr = jsonStr.slice(6)
          }
          const parsed = JSON.parse(jsonStr)
          const chunkConvId = parsed.conversationId

          // Update conversationId if it's empty
          if (chunkConvId && !conversationId.value) {
            conversationId.value = chunkConvId
          }

          // Handle both 'message' (from user example) and 'messages' (from OpenAPI)
          const messageData = (parsed as { message?: ChatmessageListChatMessageBySession200ResponseMessagesInner }).message || parsed.messages

          if (buffer) {
            if (messageData && messageData.content) {
              buffer.content += messageData.content
            }
          } else {
            // First chunk, create message
            const newMsg: ChatmessageListChatMessageBySession200ResponseMessagesInner = {
              id: 0,
              sessionId: Number(conversationId.value) || Number(chunkConvId) || 0,
              content: messageData?.content || '',
              role: messageData?.role || 'assistant',
              createTime: Date.now(),
              extra: '',
              toolCallId: messageData?.toolCallId || '',
              toolCalls: messageData?.toolCalls || []
            }

            msgHistoryStore.addMessage(newMsg)
            const lastMsg = msgHistoryStore.messages[msgHistoryStore.messages.length - 1]
            if (lastMsg) {
              buffer = lastMsg
            }
          }

        } catch (e) {
          console.error('JSON parse error', e)
        }
      }
    } catch (error) {
      console.error('Send message failed:', error)
      ElMessage.error('发送消息失败')
    } finally {
      sending.value = false
    }
  }

  return {
    sending,
    conversationId,
    sendMessage
  }
})
