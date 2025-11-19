<template>
  <div class="app relative">
<!-- 自定义ref="liveCanvas"： -->
     <canvas ref="liveCanvas"></canvas>

     <!-- 聊天气泡 -->
     <transition name="fade">
       <div v-if="displayText" class="bubble-container">
         <div class="bubble-content">
           {{ displayText }}
         </div>
         <!-- <div class="bubble-arrow"></div> -->
       </div>
     </transition>
  </div>
</template>

<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  aiMessage?: string
}>()

const displayText = ref('')
const idleMessages = [
  '今天天气真不错呢~',
  '有什么我可以帮你的吗？',
  '发呆中...',
  '好想吃鱼干啊~',
  '你今天过得怎么样？',
  '喵~'
]
let idleTimer: ReturnType<typeof setInterval> | undefined
let messageTimer: ReturnType<typeof setTimeout> | undefined

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
  }, 10000) // 每10秒切换一次空闲语句
}

watch(() => props.aiMessage, (newVal) => {
  if (newVal) {
    showMessage(newVal, 6000)
  }
})

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
  model = await Live2DModel.from('@/../public/live2d/model/白猫/白猫.model3.json')

  const originalFocus = model.focus
  model.focus = (x: number, y: number) => {
    if (!liveCanvas.value) return
    const rect = liveCanvas.value.getBoundingClientRect()
    // x, y 是相对于 canvas 左上角的坐标，所以中心点应该是 canvas 宽高的一半
    const centerX = rect.left - 140
    const centerY = rect.top + 666
    const newX = centerX + (x - centerX) * 0.1
    const newY = centerY + (y - centerY) * 0.6
    originalFocus.call(model, newX, newY)
    console.log('x: ', centerX, ', y: ', centerY)
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
.app{
  background-color: #ffffff;
  min-width: 360px;
  height: 100%;
  overflow: hidden;
}
header {
  line-height: 1;
}

.bubble-container {
  position: absolute;
  top: 8%;
  left: 75%;
  transform: translateX(-50%);
  z-index: 10;
  max-width: 80%;
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
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
