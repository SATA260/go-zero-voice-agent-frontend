import { defineStore } from 'pinia'
import { DefaultApi } from '@/api/rag/api/default-api'
import { Configuration } from '@/api/rag/configuration'
import type { DocListDoc200ResponseDocumentListInner } from '@/api/rag/model/doc-list-doc200-response-document-list-inner'
import type { DocListDocChunks200ResponseChunkListInner } from '@/api/rag/model/doc-list-doc-chunks200-response-chunk-list-inner'
import { ElMessage } from 'element-plus'

const apiConfig = new Configuration({
  basePath: '/api',
})
const ragApi = new DefaultApi(apiConfig)

interface RagState {
  // 文档列表状态
  documentList: DocListDoc200ResponseDocumentListInner[]
  total: number
  loading: boolean
  currentPage: number
  pageSize: number
  searchKeyword: string

  // 切片列表状态
  chunksData: DocListDocChunks200ResponseChunkListInner[]
  chunksTotal: number
  chunksLoading: boolean
  chunksCurrentPage: number
  chunksPageSize: number
  currentDocId: string

  // 选中的文档ID列表
  selectedDocIds: string[]
}

export const useRagStore = defineStore('rag', {
  state: (): RagState => ({
    documentList: [],
    total: 0,
    loading: false,
    currentPage: 1,
    pageSize: 10,
    searchKeyword: '',

    chunksData: [],
    chunksTotal: 0,
    chunksLoading: false,
    chunksCurrentPage: 1,
    chunksPageSize: 10,
    currentDocId: '',

    selectedDocIds: [],
  }),

  actions: {
    setSelectedDocIds(ids: string[]) {
      this.selectedDocIds = ids
    },

    getUserId() {
      return 1; // TODO: Replace with actual user ID retrieval logic
    },

    // 获取文档列表
    async fetchDocumentList() {
      const userId = this.getUserId()
      this.loading = true
      try {
        const response = await ragApi.docListDoc({
          pageQuery: {
            page: this.currentPage,
            pageSize: this.pageSize,
          },
          filter: this.searchKeyword ? { fileName: this.searchKeyword } : undefined
        }, userId)

        if (response.data) {
          this.documentList = response.data.documentList || []
          this.total = response.data.total || 0
        }
      } catch (error) {
        console.error('获取文档列表失败', error)
        ElMessage.error('获取文档列表失败')
      } finally {
        this.loading = false
      }
    },

    // 删除文档
    async deleteDocument(id: string) {
      const userId = this.getUserId()
      try {
        await ragApi.docDeleteDoc(Number(id), userId)
        ElMessage.success('删除成功')
        // 如果当前页只有一条数据且不是第一页，删除后向前翻页
        if (this.documentList.length === 1 && this.currentPage > 1) {
          this.currentPage--
        }
        await this.fetchDocumentList()
      } catch (error) {
        console.error('删除失败', error)
        ElMessage.error('删除失败')
      }
    },

    // 上传文档
    async uploadDocument(filename: string, file: File) {
      const userId = this.getUserId()
      try {
        await ragApi.docUploadAndEmbed(filename, file, userId)
        ElMessage.success('上传成功，开始向量化')
        await this.fetchDocumentList()
        return true
      } catch (error) {
        console.error('上传失败', error)
        ElMessage.error('上传失败')
        return false
      }
    },

    // 获取切片列表
    async fetchChunks() {
      if (!this.currentDocId) return

      const userId = this.getUserId()
      this.chunksLoading = true
      try {
        const response = await ragApi.docListDocChunks(this.currentDocId, {
          pageQuery: {
            page: this.chunksCurrentPage,
            pageSize: this.chunksPageSize
          }
        }, userId)

        if (response.data) {
          this.chunksData = response.data.chunkList || []
          this.chunksTotal = response.data.total || 0
        }
      } catch (error) {
        console.error('获取切片列表失败', error)
        ElMessage.error('获取切片列表失败')
      } finally {
        this.chunksLoading = false
      }
    },

    // 设置搜索关键字
    setSearchKeyword(keyword: string) {
      this.searchKeyword = keyword
      this.currentPage = 1 // 重置页码
      this.fetchDocumentList()
    },

    // 设置页码
    setPage(page: number) {
      this.currentPage = page
      this.fetchDocumentList()
    },

    // 设置每页条数
    setPageSize(size: number) {
      this.pageSize = size
      this.currentPage = 1 // 重置页码
      this.fetchDocumentList()
    },

    // 设置切片页码
    setChunksPage(page: number) {
      this.chunksCurrentPage = page
      this.fetchChunks()
    },

    // 查看文档切片
    viewDocumentChunks(docId: string) {
      this.currentDocId = docId
      this.chunksCurrentPage = 1
      this.fetchChunks()
    }
  }
})
