<template>
  <Transition name="modal">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="close"></div>

      <!-- Modal Content -->
      <div
        class="relative bg-white/95 backdrop-blur rounded-2xl shadow-2xl w-[28rem] p-8 transform transition-all border border-white/20">
        <!-- Header -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 tracking-tight">系统配置</h2>
          <p class="text-sm text-gray-500 mt-2">请选择您的语音交互参数</p>
        </div>

        <div class="space-y-6">
          <!-- ASR Config -->
          <div class="group">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span class="w-1 h-4 bg-blue-500 rounded-full"></span>
              ASR 语音识别
            </label>
            <div class="relative">
              <select v-model="currentAsrConfigId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer hover:bg-gray-100">
                <option v-for="config in asrConfigs" :key="config.id" :value="config.id">
                  {{ config.id }} - {{ config.provider }} ({{ config.language }})
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- TTS Config -->
          <div class="group">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span class="w-1 h-4 bg-purple-500 rounded-full"></span>
              TTS 语音合成
            </label>
            <div class="relative">
              <select v-model="currentTtsConfigId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all appearance-none cursor-pointer hover:bg-gray-100">
                <option v-for="config in ttsConfigs" :key="config.id" :value="config.id">
                  {{ config.id }} - {{ config.provider }}
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <!-- LLM Config -->
          <div class="group">
            <label class="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <span class="w-1 h-4 bg-green-500 rounded-full"></span>
              LLM 大语言模型
            </label>
            <div class="relative">
              <select v-model="currentLlmConfigId"
                class="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all appearance-none cursor-pointer hover:bg-gray-100">
                <option v-for="config in llmConfigs" :key="config.id" :value="config.id">
                  {{ config.id }} - {{ config.name }} ({{ config.model }})
                </option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-10">
          <button @click="close"
            class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/30 transform transition-all hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2">
            <span>确认生效</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .transform,
.modal-leave-active .transform {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .transform,
.modal-leave-to .transform {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useApiSettingStore } from '@/stores/modules/apiSetting';

defineProps<{
  visible: boolean
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'close'): void
}>();

const apiSettingStore = useApiSettingStore();

const asrConfigs = computed(() => apiSettingStore.asrConfigs);
const ttsConfigs = computed(() => apiSettingStore.ttsConfigs);
const llmConfigs = computed(() => apiSettingStore.llmConfigs);

const currentAsrConfigId = computed({
  get: () => apiSettingStore.currentAsrConfigId,
  set: (value) => {
    if (value) apiSettingStore.setCurrentAsrConfigId(value);
  }
});

const currentTtsConfigId = computed({
  get: () => apiSettingStore.currentTtsConfigId,
  set: (value) => {
    if (value) apiSettingStore.setCurrentTtsConfigId(value);
  }
});

const currentLlmConfigId = computed({
  get: () => apiSettingStore.currentLlmConfigId,
  set: (value) => {
    if (value) apiSettingStore.setCurrentLlmConfigId(value);
  }
});

onMounted(() => {
  apiSettingStore.fetchAsrConfigs();
  apiSettingStore.fetchTtsConfigs();
  apiSettingStore.fetchLlmConfigs();
});

const close = () => {
  emit('update:visible', false);
  emit('close');
};
</script>
