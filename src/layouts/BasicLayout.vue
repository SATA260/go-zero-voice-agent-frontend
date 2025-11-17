<template>
  <div class="common-layout">
    <el-container>
      <el-header class="m-0 p-0">
        <HeaderBar />
      </el-header>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import HeaderBar from '@/components/HeaderBar.vue'
import { RouterView } from 'vue-router'
</script>
