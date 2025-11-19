<template>
  <div class="sidebar">
    <!-- 新对话按钮 -->
    <div class="sidebar-item new-conversation cursor-target" @click="handleNewChat">
      <el-icon class="icon"><Edit /></el-icon>
      <span class="new-conversion-text">新对话</span>
      <el-tooltip effect="dark" content="Ctrl + K" placement="right">
        <span class="shortcut">Ctrl K</span>
      </el-tooltip>
    </div>

    <!-- 功能菜单 -->
    <div
      class="sidebar-item cursor-target"
      v-for="item in menuItems"
      :key="item.label"
      @click="handleMenuItemClick(item.label)"
      :class="[{ selected: selectedMenu === item.label }, {'shadow-md': selectedMenu === item.label}]"
    >
      <el-icon class="icon"></el-icon>
      <span>{{ item.label }}</span>
    </div>

    <!-- 最近对话分割线 -->
    <el-divider />

    <!-- 最近对话（点击展开/收起历史记录） -->
    <div class="sidebar-item recent-conversation cursor-target" @click="isCollapsed = !isCollapsed">
      <span>最近对话</span>
      <el-icon class="arrow"><ArrowDown :class="{ 'rotate-180': isCollapsed }" /></el-icon>
    </div>

    <!-- 最近对话列表 -->
    <div class="recent-list" v-show="!isCollapsed">
      <div
        class="recent-item"
        v-for="item in recentItems"
        :key="item.id"
        @click="handleRecentItemClick(item.id)"
        :class="[{ selected: selectedRecentId === item.id }, {'shadow-md': selectedRecentId === item.id}]"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义菜单项类型
interface MenuItem {
  label: string;
}

// 定义最近对话项类型
interface RecentItem {
  id: string;
  title: string;
}

// 折叠状态
const isCollapsed = ref(false);

// 选中状态
const selectedMenu = ref<string | null>(null);
const selectedRecentId = ref<string | null>(null);
const clearSelection = () => {
  selectedMenu.value = null;
  selectedRecentId.value = null;
};

// 功能菜单项数据
const menuItems = ref<MenuItem[]>([
  { label: '文字交流'},
  { label: '语音对话'},
]);

// 最近对话列表数据
const recentItems = ref<RecentItem[]>([
  { id: '1', title: '这个地方是历史记录' },
  { id: '2', title: '这个地方是历史记录' },
  { id: '3', title: '这个地方是历史记录' },
  { id: '4', title: '这个地方是历史记录' },
]);

// 新对话按钮点击事件
const handleNewChat = () => {
  clearSelection();
  console.log('开始新对话');
  // 在这里添加新对话的逻辑，例如清空当前聊天记录等
};

// 功能菜单项点击事件
const handleMenuItemClick = (label: string) => {
  clearSelection();
  console.log(`点击了功能菜单: ${label}`);
  selectedMenu.value = label;
  // 在这里添加对应功能的逻辑
};

// 最近对话项点击事件
const handleRecentItemClick = (id: string) => {
  clearSelection();
  console.log(`加载最近对话: ${id}`);
  selectedRecentId.value = id;
  // 在这里添加加载历史对话的逻辑
};

</script>

<style scoped>
/* 基础样式保持不变 */
.sidebar {
  width: 100%;
  height: 100vh;
  padding: 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: width 0.3s ease;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 8px;
  transition: background-color 0.2s;
}

.sidebar-item:hover {
  background-color: #cecece;
}

.icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 新对话按钮特殊样式 */
.new-conversation {
  background-color: #b2d7fc62;
  color: #4d4df8;
  border: #4b3ff769 1px solid;
  font-weight: 600;
}

.new-conversation:hover {
  background-color: #b2d7fcd5;
}

.new-conversation .shortcut {
  margin-left: auto;
  background-color: rgba(255, 255, 255, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.new-conversation-text {
  font-weight: 600;
}

/* 带箭头的项 */
.collapse,
.recent-conversation {
  padding-left: 32px;
  justify-content: space-between;
}

.arrow {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

/* 最近对话列表 */
.recent-list {
  margin-top: 8px;
  padding-left: 26px;
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: 200px; /* 可根据需要调整 */
}

.recent-item {
  padding: 8px 0;
  color: #606266;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-radius: 16px;
  padding: 6px 10px;
}

.recent-item:hover {
  background-color: #cecece;
}

/* 底部关于项 */
.about {
  margin-top: auto; /* 推到底部 */
}

/* 选中态：背景变白 */
.sidebar-item.selected,
.recent-item.selected {
  background-color: #ffffff;
}
</style>
