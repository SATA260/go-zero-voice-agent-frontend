<template>
  <div class="app relative">
    <!-- 自定义ref="liveCanvas"： -->
    <canvas ref="liveCanvas" @click="handleInteraction"></canvas>

    <!-- 聊天气泡 -->
    <transition name="fade">
      <div v-if="displayText" class="bubble-container">
        <div class="bubble-content">
          {{ displayText }}
        </div>
      </div>
    </transition>

    <!-- 交互菜单 -->
    <transition name="slide-up">
      <div v-if="showMenu" class="interaction-menu" @click.stop>
        <div class="menu-btn" @click="handleAction('greet')">
          <img class="btn-icon" src="@/assets/svg/逗猫棒-2.svg" />
          <span class="btn-text">打招呼</span>
        </div>
        <div v-show="!websokcetConnected" class="menu-btn" @click="handleAction('setting')">
          <img class="btn-icon" src="@/assets/svg/settings.svg" />
          <span class="btn-text">设置</span>
        </div>
        <div v-show="!websokcetConnected" class="menu-btn" @click="handleAction('call')">
          <img class="btn-icon" src="@/assets/svg/call.svg" />
          <span class="btn-text">通话</span>
        </div>
        <div v-show="websokcetConnected" class="menu-btn" @click="handleAction('mute')">
          <img class="btn-icon" src="@/assets/svg/Mute.svg" />
          <span class="btn-text">静音</span>
        </div>
        <div v-show="websokcetConnected" class="menu-btn" @click="handleAction('hangup')">
          <img class="btn-icon" src="@/assets/svg/挂断.svg" />
          <span class="btn-text">挂断</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { webRTCService } from '@/services/webrtcService';

const websokcetConnected = webRTCService.websokcetConnected;

const props = defineProps<{
  aiMessage?: string
}>()

const showMenu = ref(false)
const displayText = ref('')
const idleMessages = [
  '今天天气真不错呢~',
  '有什么我可以帮你的吗？',
  '发呆中...',
  '好想吃鱼干啊~',
  '你今天过得怎么样？',
  '喵~',
]
let idleTimer: ReturnType<typeof setInterval> | undefined
let messageTimer: ReturnType<typeof setTimeout> | undefined

const handleInteraction = () => {
  showMenu.value = !showMenu.value
  if (showMenu.value) {
    showMessage('喵？找我有什么事吗？', 3000)
  }
}

const handleAction = (action: string) => {
  showMenu.value = false
  switch (action) {
    case 'greet':
      showMessage('你好呀！很高兴见到你！', 4000)
      break
    case 'setting':
      showMessage('要设置参数吗？喵~', 4000)
      break
    case 'call':
      webRTCService.startCall();
      showMessage('正在为你接通...', 4000)
      break
    case 'mute':
      showMessage('静音中...', 4000)
      break
    case 'hangup':
      webRTCService.hangup();
      showMessage('正在为你挂断...', 1000)
      break
  }
}

const showMessage = (text: string, duration = 5000) => {
  displayText.value = text
  clearTimeout(messageTimer)
  clearInterval(idleTimer)

  // 消息显示一段时间后，恢复空闲轮播
  messageTimer = setTimeout(() => {
    startIdleLoop()
  }, duration)
}

const startIdleLoop = () => {
  clearTimeout(messageTimer)
  clearInterval(idleTimer)

  idleTimer = setInterval(() => {
    const msg = idleMessages[Math.floor(Math.random() * idleMessages.length)]
    if (msg) displayText.value = msg
  }, 7000) // 每7秒切换一次空闲语句
}

watch(
  () => props.aiMessage,
  (newVal) => {
    if (newVal) {
      showMessage(newVal, 6000)
    }
  },
)

declare global {
  interface Window {
    PIXI: typeof PIXI
  }
}

window.PIXI = PIXI // 供 pixi-live2d-display 内部调用

const liveCanvas = ref<HTMLCanvasElement | null>(null)
let app: PIXI.Application | null = null
let model: Live2DModel | null = null

onMounted(async () => {
  if (!liveCanvas.value) return

  app = new PIXI.Application({
    view: liveCanvas.value,
    autoStart: true,
    resizeTo: liveCanvas.value.parentElement as HTMLElement,
    backgroundAlpha: 0,
  })

  // public 目录下资源可从根路径直接访问
  // 使用 import.meta.env.BASE_URL 确保在非根路径部署时也能正确加载
  const baseUrl = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  model = await Live2DModel.from(`${baseUrl}live2d/model/白猫/白猫.model3.json`)

  const originalFocus = model.focus
  model.focus = (x: number, y: number) => {
    if (!liveCanvas.value) return
    const rect = liveCanvas.value.getBoundingClientRect()
    // x, y 是相对于 canvas 左上角的坐标，所以中心点应该是 canvas 宽高的一半
    const centerX = rect.left - 120
    const centerY = rect.top + 698
    const newX = centerX + (x - centerX) * 0.1
    const newY = centerY + (y - centerY) * 0.6
    originalFocus.call(model, newX, newY)
  }

  app.stage.addChild(model)
  model.scale.set(0.1)

  startIdleLoop()
})

onBeforeUnmount(() => {
  model?.destroy()
  app?.destroy(true)
  model = null
  app = null
  clearTimeout(messageTimer)
  clearInterval(idleTimer)
})
</script>

<style scoped>
.app {
  background-color: #ffffff;
  min-width: 360px;
  height: 100%;
}
header {
  line-height: 1;
}

.bubble-container {
  position: absolute;
  top: 0%;
  left: 75%;
  transform: translateX(-50%);
  width: 216px;
  z-index: 10;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bubble-content {
  background: rgba(255, 255, 255, 0.95);
  border: 2px solid #ffb6c1;
  border-radius: 16px;
  padding: 10px 16px;
  color: #4a4a4a;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(255, 182, 193, 0.3);
  text-align: center;
  line-height: 1.4;
  position: relative;
  word-break: break-all;
}

.bubble-arrow {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #ffb6c1;
  margin-top: -1px;
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.interaction-menu {
  position: absolute;
  bottom: 15%;
  left: 45%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 20;
  background: rgba(255, 255, 255, 0.95);
  padding: 10px 16px;
  border-radius: 24px;
  box-shadow: 0 8px 20px rgba(255, 182, 193, 0.3);
  border: 2px solid #fff0f5;
  backdrop-filter: blur(4px);
}

.menu-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 16px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 60px;
}

.menu-btn:hover {
  background-color: #fff0f5;
  transform: translateY(-4px);
}

.menu-btn:active {
  transform: translateY(-1px);
}

.btn-icon {
  width: 80%;
  margin-top: 4px;
  margin-bottom: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.btn-text {
  font-size: 12px;
  color: #ff6b81;
  font-weight: 600;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 40px) scale(0.9);
}
</style>
