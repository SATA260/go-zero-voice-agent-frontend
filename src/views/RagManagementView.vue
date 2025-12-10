<template>
  <div class="h-full">
    <div class="max-w-full mx-auto bg-white/90 backdrop-blur-sm rounded-[2rem] p-8 h-full flex flex-col">
      <!-- Header -->
      <div class="mb-8 flex justify-between items-center">
        <h2 class="text-3xl font-bold flex items-center gap-3">
          <img src="@/assets/svg/逗猫棒-2.svg" alt="" class="w-10 h-10 animate-bounce" />
          <span class="bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">RAG 知识库</span>
        </h2>
        <button
          class="flex items-center gap-2 px-6 py-2.5 text-pink-500 rounded-xl font-semibold hover:shadow-xl hover:-translate-y-0.5 hover:opacity-90 transition-all duration-300"
          @click="showUploadDialog = true">
          <el-icon>
            <Upload />
          </el-icon>
          <span>上传文档</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="mb-6 flex gap-4">
        <div class="relative w-72 group">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <el-icon class="text-gray-400 group-hover:text-blue-500 transition-colors">
              <Search />
            </el-icon>
          </div>
          <input v-model="searchKeyword" type="text"
            class="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all duration-300 sm:text-sm"
            placeholder="搜索文件名..." @keyup.enter="handleSearch">
          <div v-if="searchKeyword" class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            @click="handleClearSearch">
            <el-icon class="text-gray-400 hover:text-gray-600">
              <CircleClose />
            </el-icon>
          </div>
        </div>

        <button
          class="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-medium hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50 transition-all duration-300 shadow-sm"
          @click="handleSearch">
          搜索
        </button>
      </div>

      <!-- Table -->
      <div class="flex-1 overflow-hidden rounded-2xl shadow-sm border border-gray-100 bg-white">
        <el-table v-loading="loading" :data="documentList" style="width: 100%; height: 100%"
          :header-cell-style="{ background: '#f8fafc', color: '#475569', fontWeight: '600', height: '50px' }"
          :row-style="{ height: '60px' }">
          <el-table-column prop="id" label="ID" width="80" align="center" />
          <el-table-column prop="fileName" label="文件名" min-width="200" show-overflow-tooltip>
            <template #default="{ row }">
              <div class="flex items-center gap-3 overflow-hidden">
                <div class="p-2 bg-pink-50 rounded-lg text-pink-500 flex items-center justify-center shrink-0">
                  <el-icon size="16">
                    <Document />
                  </el-icon>
                </div>
                <span class="font-medium text-gray-700 truncate">{{ row.fileName }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="fileFormat" label="格式" width="100" align="center">
            <template #default="{ row }">
              <el-tag effect="plain" round class="!border-gray-200 !text-gray-500 !bg-gray-50">{{ row.fileFormat
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="{ row }">
              <el-tag :type="getStatusType(row.status)" effect="light" round class="!border-0">
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <div class="flex justify-center gap-4">
                <button
                  class="text-pink-400 hover:text-pink-600 font-medium text-sm transition-colors flex items-center gap-1"
                  @click="handleViewChunks(row)">
                  查看切片
                </button>
                <el-popconfirm title="确定要删除这个文档吗？" @confirm="handleDelete(row)">
                  <template #reference>
                    <button
                      class="text-gray-700 hover:text-gray-400 font-medium text-sm transition-colors flex items-center gap-1">
                      删除
                    </button>
                  </template>
                </el-popconfirm>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Pagination -->
      <div class="mt-6 flex justify-end">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
          @current-change="handleCurrentChange" />
      </div>

      <!-- Upload Dialog -->
      <el-dialog v-model="showUploadDialog" title="上传文档" width="500px" @close="resetUploadForm"
        class="!rounded-2xl overflow-hidden">
        <el-form :model="uploadForm" label-width="80px" class="mt-4">
          <el-form-item label="文件">
            <el-upload class="w-full" drag action="#" :auto-upload="false" :limit="1" :on-change="handleFileChange"
              :on-remove="handleFileRemove" :show-file-list="true">
              <el-icon class="el-icon--upload text-blue-400"><upload-filled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处或 <em class="text-blue-500">点击上传</em>
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item label="文件名">
            <el-input v-model="uploadForm.filename" placeholder="请输入文件名" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer flex justify-end gap-3">
            <button class="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              @click="showUploadDialog = false">取消</button>
            <button
              class="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md hover:opacity-90 transition-opacity flex items-center gap-2"
              @click="handleUpload" :disabled="uploading">
              <span v-if="uploading" class="animate-spin">↻</span>
              确定
            </button>
          </span>
        </template>
      </el-dialog>

      <!-- 切片查看抽屉 -->
      <el-drawer v-model="showChunksDrawer" title="文档切片" size="60%" class="!rounded-l-[2rem]">
        <div v-loading="chunksLoading" class="h-full flex flex-row gap-6 p-2">
          <!-- 左侧详情 -->
          <div class="w-1/3 flex flex-col overflow-hidden bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <h3 class="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <el-icon class="text-blue-500">
                <InfoFilled />
              </el-icon> 切片详情
            </h3>
            <div v-if="!selectedChunk" class="flex-1 flex flex-col justify-center items-center text-gray-400 gap-2">
              <el-icon size="40" class="opacity-20">
                <Document />
              </el-icon>
              <p>请在右侧选择切片</p>
            </div>
            <template v-else>
              <el-scrollbar class="flex-1 pr-2">
                <div class="mb-4 group">
                  <div class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">ID</div>
                  <div
                    class="text-sm text-gray-700 break-all bg-white p-3 rounded-xl border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors">
                    {{ selectedChunk.customId }}</div>
                </div>
                <div class="mb-4 group">
                  <div class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">内容</div>
                  <div
                    class="text-sm text-gray-700 whitespace-pre-wrap bg-white p-3 rounded-xl border border-gray-100 shadow-sm group-hover:border-blue-200 transition-colors leading-relaxed">
                    {{
                      selectedChunk.pageContent }}</div>
                </div>
                <div class="mb-4 group">
                  <div class="text-xs font-bold text-gray-400 uppercase mb-1 tracking-wider">元数据</div>
                  <pre
                    class="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100 shadow-sm overflow-auto group-hover:border-blue-200 transition-colors">{{ JSON.stringify(selectedChunk.metadata, null, 2) }}</pre>
                </div>
              </el-scrollbar>
            </template>
          </div>

          <!-- 右侧列表 -->
          <div class="flex-1 flex flex-col overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-sm">
            <el-table :data="chunksData" style="width: 100%" class="flex-1"
              :header-cell-style="{ background: '#f8fafc', color: '#475569' }">
              <el-table-column prop="pageContent" label="内容预览" min-width="200">
                <template #default="{ row }">
                  <div class="truncate text-gray-600">{{ row.pageContent }}</div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100" fixed="right" align="center">
                <template #default="{ row }">
                  <button class="text-pink-500 hover:text-pink-600 text-sm font-medium"
                    @click="handleSelectChunk(row)">查看</button>
                </template>
              </el-table-column>
            </el-table>

            <div class="p-4 border-t border-gray-50 flex justify-end">
              <el-pagination v-model:current-page="chunksCurrentPage" v-model:page-size="chunksPageSize"
                layout="total, prev, pager, next" :total="chunksTotal" @current-change="handleChunksPageChange" />
            </div>
          </div>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import { Search, Upload, UploadFilled, Document, InfoFilled, CircleClose } from '@element-plus/icons-vue'
import { useRagStore } from '@/stores/modules/rag'
import { storeToRefs } from 'pinia'
import type { DocListDoc200ResponseDocumentListInner } from '@/api/rag/model/doc-list-doc200-response-document-list-inner'
import type { DocListDocChunks200ResponseChunkListInner } from '@/api/rag/model/doc-list-doc-chunks200-response-chunk-list-inner'

const ragStore = useRagStore()
const {
  documentList,
  total,
  loading,
  currentPage,
  pageSize,
  searchKeyword,
  chunksData,
  chunksTotal,
  chunksLoading,
  chunksCurrentPage,
  chunksPageSize
} = storeToRefs(ragStore)

const showUploadDialog = ref(false)
const uploading = ref(false)
const uploadForm = reactive({
  filename: '',
  file: null as File | null
})

// 切片相关状态
const showChunksDrawer = ref(false)
const selectedChunk = ref<DocListDocChunks200ResponseChunkListInner | null>(null)

// 搜索
const handleSearch = () => {
  ragStore.setSearchKeyword(searchKeyword.value)
}

const handleClearSearch = () => {
  searchKeyword.value = ''
  handleSearch()
}

// 分页
const handleSizeChange = (val: number) => {
  ragStore.setPageSize(val)
}

const handleCurrentChange = (val: number) => {
  ragStore.setPage(val)
}

// 删除
const handleDelete = async (row: DocListDoc200ResponseDocumentListInner) => {
  await ragStore.deleteDocument(String(row.id))
}

// 文件选择
const handleFileChange = (uploadFile: UploadFile) => {
  if (uploadFile.raw) {
    uploadForm.file = uploadFile.raw
    // 如果没有输入文件名，自动填充文件名
    if (!uploadForm.filename) {
      uploadForm.filename = uploadFile.name
    }
  }
}

const handleFileRemove = () => {
  uploadForm.file = null
}

// 上传
const handleUpload = async () => {
  if (!uploadForm.file) {
    ElMessage.warning('请选择文件')
    return
  }
  if (!uploadForm.filename) {
    ElMessage.warning('请输入文件名')
    return
  }

  uploading.value = true
  const success = await ragStore.uploadDocument(uploadForm.filename, uploadForm.file)
  uploading.value = false

  if (success) {
    showUploadDialog.value = false
    resetUploadForm()
  }
}

const resetUploadForm = () => {
  uploadForm.filename = ''
  uploadForm.file = null
}
// 查看切片
const handleViewChunks = (row: DocListDoc200ResponseDocumentListInner) => {
  showChunksDrawer.value = true
  selectedChunk.value = null
  ragStore.viewDocumentChunks(String(row.id))
}

const handleSelectChunk = (row: DocListDocChunks200ResponseChunkListInner) => {
  selectedChunk.value = row
}

const handleChunksPageChange = (val: number) => {
  ragStore.setChunksPage(val)
}

// 状态显示
const getStatusType = (status: number) => {
  // 假设状态码：0-处理中, 1-成功, 2-失败 (具体需要根据后端定义)
  switch (status) {
    case 1: return 'success'
    case 2: return 'danger'
    default: return 'warning'
  }
}

const getStatusText = (status: number) => {
  switch (status) {
    case 0: return '处理中'
    case 1: return '已完成'
  }
}

onMounted(() => {
  ragStore.fetchDocumentList()
})
</script>

<style scoped>
/* No deep selectors used for main layout, relying on Tailwind and native elements */
</style>
