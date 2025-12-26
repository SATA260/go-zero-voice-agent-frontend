import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useApiSettingStore } from '@/stores/modules/apiSetting'
import { useMsgHistoryStore } from '@/stores/modules/msgHistory'
import { useRagStore } from '@/stores/modules/rag'
import { ElMessage } from 'element-plus'
import type { ChatTextChatRequest, ChatmessageListChatMessageBySession200ResponseMessagesInner, ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInner } from '@/api/llm/model'

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

  const resetConversation = () => {
    conversationId.value = ''
    sending.value = false
  }

  const sendToolCalls = async (payload: { toolCalls: ChatmessageListChatMessageBySession200ResponseMessagesInnerToolCallsInner[]; toolCallId?: string }) => {
    if (sending.value) return

    const configId = apiSettingStore.currentLlmConfigId
    if (!configId) {
      ElMessage.warning('请先选择LLM配置')
      return
    }

    if (!conversationId.value) {
      ElMessage.warning('当前会话未建立，无法提交工具结果')
      return
    }

    sending.value = true

    const request: ChatTextChatRequest & Record<string, any> = {
      configId,
      message: '',
      isStream: true,
      conversationId: conversationId.value || undefined,
      autoFillHistory: true,
      role: 'tool',
      toolCalls: payload.toolCalls,
      toolCallId: payload.toolCallId || '',
    }

    try {
      const response = await fetch('/api/llm/v1/chat/text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'X-User-Id': String(msgHistoryStore.getUserId())
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Readable stream not available')

      const decoder = new TextDecoder()
      let buffer: ChatmessageListChatMessageBySession200ResponseMessagesInner | null = null
      let sseBuffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        sseBuffer += decoder.decode(value, { stream: true })
        const events = sseBuffer.split('\n\n')
        sseBuffer = events.pop() || ''

        for (const evt of events) {
          const dataLines = evt
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.replace(/^data:\s?/, ''))
          const dataPayload = dataLines.join('\n').trim()
          if (!dataPayload) continue

          try {
            const parsed = JSON.parse(dataPayload)
            const chunkConvId = parsed.conversationId

            if (chunkConvId && !conversationId.value) {
              conversationId.value = chunkConvId
            }

            const messageData = (parsed as { message?: ChatmessageListChatMessageBySession200ResponseMessagesInner }).message || parsed.messages

            if (buffer) {
              if (messageData && messageData.content) {
                buffer.content += messageData.content
              }
            } else {
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
              if (lastMsg) buffer = lastMsg
            }
          } catch (e) {
            console.error('JSON parse error', e)
          }
        }
      }
    } catch (error) {
      console.error('Send tool calls failed:', error)
      ElMessage.error('发送工具处理结果失败')
    } finally {
      sending.value = false
    }
  }

  return {
    sending,
    conversationId,
    sendMessage,
    sendToolCalls,
    resetConversation,
  }
})
