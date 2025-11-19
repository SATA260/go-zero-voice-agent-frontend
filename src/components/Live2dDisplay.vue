<template>
  <div class="app">
<!-- 自定义ref="liveCanvas"： -->
     <canvas ref="liveCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Live2DModel } from 'pixi-live2d-display/cubism4'
import { onBeforeUnmount, onMounted, ref } from 'vue'

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
})

onBeforeUnmount(() => {
  model?.destroy()
  app?.destroy(true)
  model = null
  app = null
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
</style>
