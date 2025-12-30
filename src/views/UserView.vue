<template>
  <div class="user-view">
    <div class="user-container">
      <h1 class="page-title">用户中心</h1>

      <div class="user-card">
        <div class="user-header">
          <div class="avatar-wrapper">
            <el-icon class="avatar-icon" :size="64">
              <User />
            </el-icon>
          </div>
          <div class="user-info">
            <h2 class="user-email">{{ userStore.userInfo?.email || '未登录' }}</h2>
            <p class="user-id">用户ID: {{ userStore.userId || '1' }}</p>
          </div>
        </div>

        <el-divider />

        <div class="user-actions">
          <el-button
            type="danger"
            size="large"
            class="logout-btn"
            @click="handleLogout"
          >
            退出登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/modules/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/auth')
}
</script>

<style scoped>
.user-view {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff0f5 0%, #ffe4e8 100%);
  padding: 40px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-container {
  width: 100%;
  max-width: 600px;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #ff6b81 0%, #ff9a9e 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  margin-bottom: 32px;
}

.user-card {
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(255, 107, 129, 0.15);
  border: 2px solid #ffb6c1;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffe4e8 0%, #fff0f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid #ffb6c1;
}

.avatar-icon {
  color: #ff6b81;
}

.user-info {
  flex: 1;
}

.user-email {
  font-size: 24px;
  font-weight: 700;
  color: #ff6b81;
  margin: 0 0 8px 0;
}

.user-id {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.user-actions {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}

.logout-btn {
  width: 200px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b81 0%, #ff9a9e 100%);
  border: none;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 107, 129, 0.3);
}

:deep(.el-button--danger) {
  background: linear-gradient(135deg, #ff6b81 0%, #ff9a9e 100%);
  border: none;
  color: white;
}

:deep(.el-button--danger:hover) {
  background: linear-gradient(135deg, #ff5571 0%, #ff8a8e 100%);
}

:deep(.el-divider) {
  border-color: #ffe4e8;
  margin: 24px 0;
}
</style>
