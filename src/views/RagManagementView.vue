<template>
  <div class="rag-management p-6 h-full flex flex-col">
    <div class="header mb-4 flex justify-between items-center">
      <h2 class="text-xl font-bold">RAG 切片管理</h2>
      <el-button type="primary" @click="showUploadDialog = true">
        <el-icon class="mr-1">
          <Upload />
        </el-icon> 上传文档
      </el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar mb-4 flex gap-2">
      <el-input v-model="searchKeyword" placeholder="搜索文件名" clearable @clear="handleSearch" @keyup.enter="handleSearch"
        class="w-64">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-button @click="handleSearch">搜索</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="loading" :data="documentList" style="width: 100%" class="flex-1" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="fileName" label="文件名" min-width="200" />
      <el-table-column prop="fileFormat" label="格式" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" size="small" link @click="handleViewChunks(row)">查看切片</el-button>
          <el-popconfirm title="确定要删除这个文档吗？" @confirm="handleDelete(row)">
            <template #reference>
              <el-button type="danger" size="small" link>删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination mt-4 flex justify-end">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 上传对话框 -->
    <el-dialog v-model="showUploadDialog" title="上传文档" width="500px" @close="resetUploadForm">
      <el-form :model="uploadForm" label-width="80px">
        <el-form-item label="文件">
          <el-upload class="w-full" drag action="#" :auto-upload="false" :limit="1" :on-change="handleFileChange"
            :on-remove="handleFileRemove" :show-file-list="true">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处或 <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="uploadForm.filename" placeholder="请输入文件名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showUploadDialog = false">取消</el-button>
          <el-button type="primary" @click="handleUpload" :loading="uploading">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 切片查看抽屉 -->
    <el-drawer v-model="showChunksDrawer" title="文档切片" size="60%">
      <div v-loading="chunksLoading" class="h-full flex flex-row gap-4">
        <!-- 左侧详情 -->
        <div class="w-1/3 border-r pr-4 flex flex-col overflow-hidden">
          <h3 class="text-lg font-bold mb-4">切片详情</h3>
          <div v-if="!selectedChunk" class="flex-1 flex justify-center items-center text-gray-400">
            请在右侧选择切片
          </div>
          <template v-else>
            <el-scrollbar class="flex-1">
              <div class="mb-4">
                <div class="text-sm font-bold text-gray-700 mb-2">ID</div>
                <div class="text-sm text-gray-600 break-all bg-gray-50 p-2 rounded">{{ selectedChunk.customId }}</div>
              </div>
              <div class="mb-4">
                <div class="text-sm font-bold text-gray-700 mb-2">内容</div>
                <div class="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-2 rounded">{{
                  selectedChunk.pageContent }}</div>
              </div>
              <div class="mb-4">
                <div class="text-sm font-bold text-gray-700 mb-2">元数据</div>
                <pre
                  class="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto">{{ JSON.stringify(selectedChunk.metadata, null, 2) }}</pre>
              </div>
            </el-scrollbar>
          </template>
        </div>

        <!-- 右侧列表 -->
        <div class="flex-1 flex flex-col overflow-hidden">
          <el-table :data="chunksData" style="width: 100%" class="flex-1" border>
            <el-table-column prop="pageContent" label="内容" min-width="200">
              <template #default="{ row }">
                <div class="truncate">{{ row.pageContent }}</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" size="small" link @click="handleSelectChunk(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination mt-4 flex justify-end">
            <el-pagination v-model:current-page="chunksCurrentPage" v-model:page-size="chunksPageSize"
              layout="total, prev, pager, next" :total="chunksTotal" @current-change="handleChunksPageChange" />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { ElMessage, type UploadFile } from 'element-plus'
import { Search, Upload, UploadFilled } from '@element-plus/icons-vue'
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
.rag-management {
  background-color: #fff;
}
</style>
