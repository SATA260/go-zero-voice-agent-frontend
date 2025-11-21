<template>
  <div
    class="voice-chat-container bg-white h-full max-h-full overflow-hidden flex flex-col md:flex-row"
  >
    <!-- Live2D 区域：移动端隐藏，桌面端显示 -->
    <div
      class="live2d-wrapper hidden md:block md:w-[360px] lg:w-[400px] h-[90%] pt-[5%] border-r border-gray-100 relative flex-shrink-0"
    >
      <Live2dDisplay :ai-message="currentAiMessage" />
    </div>

    <!-- 聊天区域：占满剩余空间 -->
    <div class="chat-wrapper flex-1 h-full min-w-0">
      <ChatBox @ai-message="handleAiMessage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Live2dDisplay from '@/components/Live2dDisplay.vue'
import ChatBox from '@/components/ChatBox.vue'

const currentAiMessage = ref('')

const handleAiMessage = (msg: string) => {
  currentAiMessage.value = msg
}
</script>
<style scoped></style>
