<script setup lang="ts">
  import TargetCursor from "@/Animations/TargetCursor/TargetCursor.vue";
</script>

<template>
  <TargetCursor
        :spin-duration="2"
        :hide-default-cursor="true"
  />
  <RouterView />
</template>

<style scoped>

</style>
