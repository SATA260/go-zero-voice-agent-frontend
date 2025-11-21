import { useApiSettingStore } from '@/stores/modules/apiSetting'

export interface AsrConfig {
  provider: string
  appId: string
  secretId: string
  secretKey: string
  language: string
}

export interface TtsConfig {
  provider: string
  appId: string
  secretId: string
  secretKey: string
}

export interface WebRTCMessage {
  type: string // 消息类型: offer / answer / ice-candidate
  sdp?: string // SDP 内容（仅 offer / answer 时有）
  candidate?: RTCIceCandidateInit // ICE 候选（仅 ice-candidate 时有）
  text?: string
  assistantId?: number // int64 对应 number
  systemPrompt?: string
  knowledgeInfo?: string

  asrConfig?: AsrConfig
  ttsConfig?: TtsConfig
}

class WebRTCService {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private socket: WebSocket | null = null
  private pendingCandidates: RTCIceCandidateInit[] = []

  constructor() {
    // 初始化配置
  }

  // 开始通话
  async startCall() {
    // 先断开已有连接
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      await this.hangup()
    }

    // 获取asr,tts,llm配置
    const apiSettingStore = useApiSettingStore()
    await apiSettingStore.fetchAsrConfigs()
    await apiSettingStore.fetchTtsConfigs()
    await apiSettingStore.fetchLlmConfigs()
    const asrConfig = apiSettingStore.currentAsrConfig
    const ttsConfig = apiSettingStore.currentTtsConfig
    const llmConfig = apiSettingStore.activeLlmConfig
    if (!asrConfig) {
      throw new Error('ASR configuration is not set')
    }
    if (!ttsConfig) {
      throw new Error('TTS configuration is not set')
    }
    if (!llmConfig) {
      throw new Error('LLM configuration is not set')
    }

    // 创建 WebSocket 连接
    const newSocket = new WebSocket('ws://localhost:3083/voice/v1/chat/start')

    newSocket.onopen = async () => {
      console.log('WebSocket connected')

      try {
        // 创建 RtcPeerConnection
        const newPeerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
        })

        // 麦克风音频流
        const newLocalStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
          },
          video: false,
        })

        await newLocalStream.getTracks().forEach((track) => {
          newPeerConnection.addTrack(track, newLocalStream)
        })

        // 收集ICE候选
        newPeerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            newSocket.send(
              JSON.stringify({
                type: 'candidate',
                candidate: event.candidate,
              }),
            )
          } else if (event.candidate) {
            console.log('All ICE candidates have been sent')
          }
        }

        newPeerConnection.ontrack = (event) => {
          const remoteAudio = new Audio()
          if (event.streams[0]) {
            remoteAudio.srcObject = event.streams[0]
            remoteAudio.play().catch((error) => {
              console.error('Error playing remote audio:', error)
            })
          }
        }

        newPeerConnection.onconnectionstatechange = () => {
          console.log('Connection state change:', newPeerConnection.connectionState)
          switch (newPeerConnection.connectionState) {
            case 'connected':
              console.log('WebRTC connected!')
              break
            case 'disconnected':
            case 'failed':
            case 'closed':
              console.log('Connection closed')
              break
          }
        }

        // 创建并发送 offer
        const offer = await newPeerConnection.createOffer()
        await newPeerConnection.setLocalDescription(offer)
        const newOffer: WebRTCMessage = {
          type: 'offer',
          sdp: offer.sdp,
          asrConfig: asrConfig,
          ttsConfig: ttsConfig,
        }
        await newSocket.send(JSON.stringify(newOffer))

        this.peerConnection = newPeerConnection
        this.localStream = newLocalStream
      } catch (error) {
        console.error('Error during WebSocket onopen:', error)
      }
    }

    // 处理websocket消息
    newSocket.onmessage = (event) => this.handleWebSocketMessage(event)

    newSocket.onclose = () => {
      console.log('WebSocket closed')
      this.hangup()
    }

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.hangup()
    }

    this.socket = newSocket
  }

  // 挂断
  hangup() {
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }
    if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
      this.socket.close()
      this.socket = null
    }
  }

  private async handleWebSocketMessage(event: MessageEvent) {
    const message: WebRTCMessage = JSON.parse(event.data)

    if (!this.peerConnection) {
      console.error('PeerConnection is not established')
      return
    }

    switch (message.type) {
      case 'answer':
        console.log('[WebRTC] Received answer, sdp:', message.sdp)

        if (this.peerConnection && message.sdp) {
          const remoteDesc = new RTCSessionDescription({
            type: 'answer',
            sdp: message.sdp,
          })
          await this.peerConnection.setRemoteDescription(remoteDesc)
          console.log('[WebRTC] set remote description: ', remoteDesc)

          for (const candidate of this.pendingCandidates) {
            try {
              await this.peerConnection.addIceCandidate(candidate)
            } catch (error) {
              console.error('Error adding ICE candidate:', error)
            }
          }
          this.pendingCandidates = []
        } else {
          console.error('No SDP in answer message')
        }

        break
      case 'ice-candidate':
        if (this.peerConnection && message.candidate) {
          try {
            await this.peerConnection.addIceCandidate(message.candidate)
          } catch (error) {
            console.error('Error adding ICE candidate:', error)
          }
        } else {
          if (message.candidate) {
            this.pendingCandidates.push(message.candidate)
            console.log('ICE candidate added to pending list')
          }
        }
        break
      case 'asr-final':
        console.log('[WebRTC] ASR Final Result:', message.text)
        break
      default:
        console.warn('Unknown message type:', message)
        break
    }
  }
}

// 导出单例方便全局使用
export const webRTCService = new WebRTCService()
