<template>
  <main>
    <HeaderApp />
    <RouterView />
  </main>
</template>

<script setup lang="ts">
  import HeaderApp from '@/features/interface/layout/header/HeaderApp.vue'
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  main {
    container-type: inline-size;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow-y: hidden;
    position: sticky;
    top: 0;
  }
</style>
