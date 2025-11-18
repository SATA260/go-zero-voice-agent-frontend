<template>
  <div class="basic-layout">
    <el-container class="h-screen">
      <el-header class="m-0 p-0">
        <HeaderBar />
      </el-header>
      <el-main class="p-0 m-0 h-full">
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import { RouterView } from 'vue-router'
</script>

<style scoped>
</style>
