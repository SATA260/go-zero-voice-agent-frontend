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
    resizeTo: window,
    backgroundAlpha: 0,
  })

  // public 目录下资源可从根路径直接访问
  model = await Live2DModel.from('@/../public/live2d/model/白猫/白猫.model3.json')

  app.stage.addChild(model)
  model.scale.set(0.2)
})

onBeforeUnmount(() => {
  model?.destroy()
  app?.destroy(true)
  model = null
  app = null
})
</script>
<template>
  <div class="app">
<!-- 自定义ref="liveCanvas"： -->
     <canvas ref="liveCanvas"></canvas>
  </div>
</template>

<style scoped>
.app{
  background-color: #f1e6aa;
}
header {
  line-height: 1.5;
}
</style>
