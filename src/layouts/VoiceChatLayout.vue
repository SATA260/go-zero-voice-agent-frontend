<template>
  <div class="voice-chat-layout">
    <el-container class="h-full">
      <!-- 侧边栏：overlay 在移动端始终启用（isMobile），通过 collapsed 控制显隐 -->
      <el-aside
        :class="[{ collapsed: !showAside }, { overlay: isMobile }]"
        class="aside bg-[#fff0f5] w-76 p-0 border-r border-pink-100"
      >
        <div class="aside-content">
          <ChatAside />
        </div>
      </el-aside>

      <!-- 移动端遮罩：打开侧边栏时显示，点击关闭 -->
      <div v-if="isMobile && showAside" class="overlay-backdrop" @click="toggleAside"></div>

      <el-main class="main">
        <!-- 主区顶部：移动端显示菜单按钮，桌面也可显示 -->
        <div class="main-top">
          <img
            src="@/assets/svg/展开.svg"
            v-show="!showAside"
            class="main-toggle"
            @click="toggleAside"
            aria-label="切换侧边栏"
          />
          <img
            src="@/assets/svg/收起.svg"
            v-show="showAside"
            class="main-toggle"
            @click="toggleAside"
            aria-label="切换侧边栏"
          />
        </div>
        <div class="main-body h-full">
          <VoiceChatView />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import ChatAside from '@/components/ChatAside.vue'
import VoiceChatView from '@/views/VoiceChatView.vue'

const minWidthForAside = 768
const isMobile = ref(window.innerWidth < minWidthForAside)
const showAside = ref(!isMobile.value)

function onResize() {
  isMobile.value = window.innerWidth < minWidthForAside
  // 当进入移动端时默认收起侧边栏；离开移动端则展开
  if (isMobile.value) {
    showAside.value = false
  } else {
    showAside.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
})

function toggleAside() {
  // 切换展开/收起
  showAside.value = !showAside.value
}
</script>

<style scoped>
.voice-chat-layout {
  height: 100%;
  background-color: #ffffff;
}

/* el-aside 的基础样式，宽度与过渡（默认无延迟） */
.aside {
  min-width: 0; /* 保证 flex 收缩 */
  overflow: hidden; /* 隐藏内容折叠时溢出 */
  transition:
    width 0.28s ease 0s,
    padding 0.28s ease 0s,
    transform 0.28s ease 0s,
    box-shadow 0.2s ease 0s;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

/* 收起时将宽度缩至 0，并去掉内边距。
   我们为 collapsed 状态加上宽度 transition 的延迟（等待内容隐去） */
.aside.collapsed {
  width: 0;
  padding: 0;
  transition:
    width 0.28s ease 0.18s,
    padding 0.28s ease 0.18s;
}

/* 侧边的显示内容渐隐动画
   默认：无延迟（收起时内容应先淡出）
   在展开（非 collapsed）时，内容淡入延迟等于宽度/滑动持续时间，确保先完成展开再显示内容 */
.aside .aside-content {
  opacity: 1;
  transition: opacity 0.18s ease 0s;
  margin-top: 0.5rem;
}
.aside.collapsed .aside-content {
  opacity: 0;
  pointer-events: none;
}
/* 展开时延迟内容淡入（等同于宽度/transform 的时长 280ms）*/
.aside:not(.collapsed) .aside-content {
  transition-delay: 0.28s;
}

/* 移动端以覆盖方式展示（overlay）：
   使用 transform 实现滑动，默认隐藏在左侧外（transform: translateX(-100%）） */
.aside.overlay {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  z-index: 60;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  transform: translateX(-100%); /* 默认隐藏在左侧外 */
}
/* 移动端显示（未 collapsed）：滑入屏幕，立即开始 transform，无延迟 */
.aside.overlay:not(.collapsed) {
  transform: translateX(0);
  transition: transform 0.28s ease 0s;
}
/* 移动端收起时：延迟 transform（先隐藏内容） */
.aside.overlay.collapsed {
  transform: translateX(-100%);
  transition: transform 0.28s ease 0.18s;
}

/* 控制按钮样式 */
.aside-controls {
  display: flex;
  justify-content: flex-end;
}
.control-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 6px;
  color: white;
  font-weight: 600;
}
.control-btn:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* 主区顶部工具 */
.main-top {
  padding: 0.5rem;
  position: fixed;
}
.main-toggle {
  border: none;
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}
.main-toggle:hover {
  background: rgba(0, 0, 0, 0.08);
}

/* 遮罩层 */
.overlay-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.36);
  z-index: 55;
  transition: opacity 0.18s ease;
}

/* 当侧边栏收起时，主区域在桌面端铺满空间（自动实现，不需额外样式） */

/* 可选：在超小屏幕上默认隐藏侧边栏（兜底） */
@media (max-width: 768px) {
  .aside:not(.overlay) {
    position: absolute;
    transform: translateX(-100%);
  }
}
</style>
