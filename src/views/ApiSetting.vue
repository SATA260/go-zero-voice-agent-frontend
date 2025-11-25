<template>
  <div class="api-setting-view h-full">
    <div class="max-w-full mx-auto bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 h-full">
      <h2 class="text-3xl font-bold mb-8 flex items-center gap-3">
        <!-- <span class="text-4xl animate-bounce">✨</span> -->
        <img src="@/assets/svg/猫爪.svg" alt="" class="w-10 h-10 animate-bounce" />
        <span class="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">API 设置</span>
      </h2>

      <el-tabs v-model="activeTab" class="demo-tabs">
      <!-- ASR 设置 -->
      <el-tab-pane label="ASR 设置" name="asr">
        <div class="mb-4">
          <el-button type="primary" @click="openCreateAsrDialog" class="cursor-target">添加 ASR 配置</el-button>
        </div>

        <el-table :data="apiStore.asrConfigs" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="provider" label="提供商" width="120" />
          <el-table-column prop="appId" label="App ID" />
          <el-table-column prop="language" label="语言" width="100" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag v-if="apiStore.currentAsrConfigId === scope.row.id" type="success">当前使用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                @click="apiStore.setCurrentAsrConfigId(scope.row.id)"
                :disabled="apiStore.currentAsrConfigId === scope.row.id"
                class="cursor-target"
              >
                选择
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleEditAsr(scope.row)"
                class="cursor-target"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteAsr(scope.row.id)"
                class="cursor-target"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- TTS 设置 -->
      <el-tab-pane label="TTS 设置" name="tts">
        <div class="mb-4">
          <el-button type="primary" @click="openCreateTtsDialog" class="cursor-target">添加 TTS 配置</el-button>
        </div>

        <el-table :data="apiStore.ttsConfigs" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="provider" label="提供商" width="120" />
          <el-table-column prop="appId" label="App ID" />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag v-if="apiStore.currentTtsConfigId === scope.row.id" type="success">当前使用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                @click="apiStore.setCurrentTtsConfigId(scope.row.id)"
                :disabled="apiStore.currentTtsConfigId === scope.row.id"
                class="cursor-target"
              >
                选择
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleEditTts(scope.row)"
                class="cursor-target"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteTts(scope.row.id)"
                class="cursor-target"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- LLM 设置 -->
      <el-tab-pane label="LLM 设置" name="llm">
        <div class="mb-4">
          <el-button type="primary" @click="openCreateLlmDialog" class="cursor-target">添加 LLM 配置</el-button>
        </div>

        <el-table :data="apiStore.llmConfigs" style="width: 100%" border>
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="name" label="名称" width="150" />
          <el-table-column prop="model" label="模型" width="150" />
          <el-table-column prop="baseUrl" label="Base URL" show-overflow-tooltip />
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <el-tag v-if="apiStore.currentLlmConfigId === scope.row.id" type="success">当前使用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template #default="scope">
              <el-button
                size="small"
                @click="apiStore.setCurrentLlmConfigId(scope.row.id)"
                :disabled="apiStore.currentLlmConfigId === scope.row.id"
                class="cursor-target"
              >
                选择
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleEditLlm(scope.row)"
                class="cursor-target"
              >
                编辑
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="handleDeleteLlm(scope.row.id)"
                class="cursor-target"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- ASR Dialog -->
    <el-dialog v-model="showAsrDialog" :title="editingAsrId ? '编辑 ASR 配置' : '添加 ASR 配置'" width="500px">
      <el-form :model="asrForm" label-width="100px">
        <el-form-item label="提供商">
          <el-select v-model="asrForm.provider" placeholder="选择提供商">
            <el-option label="Volcengine" value="volcengine" />
            <el-option label="Tencent" value="tencent" />
          </el-select>
        </el-form-item>
        <el-form-item label="App ID">
          <el-input v-model="asrForm.appId" />
        </el-form-item>
        <el-form-item label="Secret ID">
          <el-input v-model="asrForm.secretId" />
        </el-form-item>
        <el-form-item label="Secret Key">
          <el-input v-model="asrForm.secretKey" type="password" show-password />
        </el-form-item>
        <el-form-item label="语言">
          <el-input v-model="asrForm.language" placeholder="zh-CN" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showAsrDialog = false">取消</el-button>
          <el-button type="primary" @click="submitAsr">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- TTS Dialog -->
    <el-dialog v-model="showTtsDialog" :title="editingTtsId ? '编辑 TTS 配置' : '添加 TTS 配置'" width="500px">
      <el-form :model="ttsForm" label-width="100px">
        <el-form-item label="提供商">
          <el-select v-model="ttsForm.provider" placeholder="选择提供商">
            <el-option label="Volcengine" value="volcengine" />
            <el-option label="Tencent" value="tencent" />
          </el-select>
        </el-form-item>
        <el-form-item label="App ID">
          <el-input v-model="ttsForm.appId" />
        </el-form-item>
        <el-form-item label="Secret ID">
          <el-input v-model="ttsForm.secretId" />
        </el-form-item>
        <el-form-item label="Secret Key">
          <el-input v-model="ttsForm.secretKey" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showTtsDialog = false">取消</el-button>
          <el-button type="primary" @click="submitTts">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- LLM Dialog -->
    <el-dialog v-model="showLlmDialog" :title="editingLlmId ? '编辑 LLM 配置' : '添加 LLM 配置'" width="600px">
      <el-form :model="llmForm" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="llmForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="llmForm.description" />
        </el-form-item>
        <el-form-item label="Base URL">
          <el-input v-model="llmForm.baseUrl" />
        </el-form-item>
        <el-form-item label="API Key">
          <el-input v-model="llmForm.apiKey" type="password" show-password />
        </el-form-item>
        <el-form-item label="模型">
          <el-input v-model="llmForm.model" />
        </el-form-item>
        <el-form-item label="Max Tokens">
          <el-input-number v-model="llmForm.maxTokens" :min="1" />
        </el-form-item>
        <el-form-item label="Temperature">
          <el-input-number v-model="llmForm.temperature" :min="0" :max="2" :step="0.1" />
        </el-form-item>
        <el-form-item label="Top P">
          <el-input-number v-model="llmForm.topP" :min="0" :max="1" :step="0.1" />
        </el-form-item>
        <el-form-item label="Top K">
          <el-input-number v-model="llmForm.topK" :min="0" />
        </el-form-item>
        <el-form-item label="Context Length">
          <el-input-number v-model="llmForm.contextLength" :min="1" />
        </el-form-item>
        <el-form-item label="功能开关">
          <el-checkbox v-model="llmForm.enableSearch" :true-label="1" :false-label="0">搜索</el-checkbox>
          <el-checkbox v-model="llmForm.enableThinking" :true-label="1" :false-label="0">思考</el-checkbox>
          <el-checkbox v-model="llmForm.stream" :true-label="1" :false-label="0">流式</el-checkbox>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showLlmDialog = false">取消</el-button>
          <el-button type="primary" @click="submitLlm">确定</el-button>
        </span>
      </template>
    </el-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useApiSettingStore } from '@/stores/modules/apiSetting'
import { ElMessage, ElMessageBox } from 'element-plus'
import type {
  AsrListAsrConfig200ResponseConfigListInner,
  TtsListTtsConfig200ResponseConfigListInner
} from '@/api/voicechat/model'
import type {
  ConfigListMyConfig200ResponseConfigsInner
} from '@/api/llm/model'

const apiStore = useApiSettingStore()
const activeTab = ref('asr')

// Dialog visibility
const showAsrDialog = ref(false)
const showTtsDialog = ref(false)
const showLlmDialog = ref(false)

// Editing states
const editingAsrId = ref<number | null>(null)
const editingTtsId = ref<number | null>(null)
const editingLlmId = ref<number | null>(null)

// Forms
const asrForm = reactive({
  provider: 'volcengine',
  appId: '',
  secretId: '',
  secretKey: '',
  language: 'zh-CN'
})

const ttsForm = reactive({
  provider: 'volcengine',
  appId: '',
  secretId: '',
  secretKey: ''
})

const llmForm = reactive({
  name: '',
  description: '',
  baseUrl: '',
  apiKey: '',
  model: '',
  maxTokens: 4096,
  temperature: 0.7,
  topP: 1.0,
  topK: 0,
  presencePenalty: 0,
  repetitionPenalty: 1.0,
  contextLength: 4096,
  enableSearch: 0,
  enableThinking: 0,
  stream: 1,
  seed: 0
})

// Actions
const openCreateAsrDialog = () => {
  editingAsrId.value = null
  Object.assign(asrForm, {
    provider: 'volcengine',
    appId: '',
    secretId: '',
    secretKey: '',
    language: 'zh-CN'
  })
  showAsrDialog.value = true
}

const handleEditAsr = (row: AsrListAsrConfig200ResponseConfigListInner) => {
  editingAsrId.value = row.id
  Object.assign(asrForm, {
    provider: row.provider,
    appId: row.appId,
    secretId: row.secretId,
    secretKey: row.secretKey,
    language: row.language
  })
  showAsrDialog.value = true
}

const submitAsr = async () => {
  try {
    if (editingAsrId.value) {
      await apiStore.updateAsrConfig(editingAsrId.value, { ...asrForm })
      ElMessage.success('ASR 配置更新成功')
    } else {
      await apiStore.createAsrConfig({ ...asrForm })
      ElMessage.success('ASR 配置创建成功')
    }
    showAsrDialog.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error(editingAsrId.value ? '更新失败' : '创建失败')
  }
}

const handleDeleteAsr = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', { type: 'warning' })
    await apiStore.deleteAsrConfig(id)
    ElMessage.success('删除成功')
  } catch (e) {
    console.error(e)
  }
}

const openCreateTtsDialog = () => {
  editingTtsId.value = null
  Object.assign(ttsForm, {
    provider: 'volcengine',
    appId: '',
    secretId: '',
    secretKey: ''
  })
  showTtsDialog.value = true
}

const handleEditTts = (row: TtsListTtsConfig200ResponseConfigListInner) => {
  editingTtsId.value = row.id
  Object.assign(ttsForm, {
    provider: row.provider,
    appId: row.appId,
    secretId: row.secretId,
    secretKey: row.secretKey
  })
  showTtsDialog.value = true
}

const submitTts = async () => {
  try {
    if (editingTtsId.value) {
      await apiStore.updateTtsConfig(editingTtsId.value, { ...ttsForm })
      ElMessage.success('TTS 配置更新成功')
    } else {
      await apiStore.createTtsConfig({ ...ttsForm })
      ElMessage.success('TTS 配置创建成功')
    }
    showTtsDialog.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error(editingTtsId.value ? '更新失败' : '创建失败')
  }
}

const handleDeleteTts = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', { type: 'warning' })
    await apiStore.deleteTtsConfig(id)
    ElMessage.success('删除成功')
  } catch (e) {
    console.error(e)
  }
}

const openCreateLlmDialog = () => {
  editingLlmId.value = null
  Object.assign(llmForm, {
    name: '',
    description: '',
    baseUrl: '',
    apiKey: '',
    model: '',
    maxTokens: 4096,
    temperature: 0.7,
    topP: 1.0,
    topK: 0,
    presencePenalty: 0,
    repetitionPenalty: 1.0,
    contextLength: 4096,
    enableSearch: 0,
    enableThinking: 0,
    stream: 1,
    seed: 0
  })
  showLlmDialog.value = true
}

const handleEditLlm = (row: ConfigListMyConfig200ResponseConfigsInner) => {
  editingLlmId.value = row.id
  Object.assign(llmForm, {
    name: row.name,
    description: row.description,
    baseUrl: row.baseUrl,
    apiKey: row.apiKey,
    model: row.model,
    maxTokens: row.maxTokens,
    temperature: row.temperature,
    topP: row.topP,
    topK: row.topK,
    presencePenalty: row.presencePenalty,
    repetitionPenalty: row.repetitionPenalty,
    contextLength: row.contextLength,
    enableSearch: row.enableSearch,
    enableThinking: row.enableThinking,
    stream: row.stream,
    seed: row.seed
  })
  showLlmDialog.value = true
}

const submitLlm = async () => {
  try {
    if (editingLlmId.value) {
      await apiStore.updateLlmConfig(editingLlmId.value, { ...llmForm })
      ElMessage.success('LLM 配置更新成功')
    } else {
      await apiStore.createLlmConfig({ ...llmForm })
      ElMessage.success('LLM 配置创建成功')
    }
    showLlmDialog.value = false
  } catch (error) {
    console.error(error)
    ElMessage.error(editingLlmId.value ? '更新失败' : '创建失败')
  }
}

const handleDeleteLlm = async (id: number) => {
  try {
    await ElMessageBox.confirm('确定要删除该配置吗？', '提示', { type: 'warning' })
    await apiStore.deleteLlmConfig(id)
    ElMessage.success('删除成功')
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  apiStore.fetchAsrConfigs()
  apiStore.fetchTtsConfigs()
  apiStore.fetchLlmConfigs()
})
</script>

<style scoped>
.api-setting-view {
  /* background: linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%); */
  /* background: #f8f2f6; */
  min-height: 100vh;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  transform: scale(1.02);
}

:deep(.el-button) {
  border-radius: 20px;
}

:deep(.el-table) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-button--primary) {
  background: linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%);
  border: none;
  color: #fff;
  font-weight: 600;
}

:deep(.el-button--primary:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 154, 158, 0.3);
}

:deep(.el-button--danger) {
  background: #ff8787;
  border: none;
}

:deep(.el-tag--success) {
  background-color: #e6fffa;
  border-color: #b2f5ea;
  color: #2c7a7b;
  border-radius: 12px;
}

:deep(.el-input__wrapper) {
  border-radius: 20px;
  padding: 8px 15px;
}

:deep(.el-select__wrapper) {
  border-radius: 20px;
}
</style>
