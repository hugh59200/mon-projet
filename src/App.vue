<template>
  <SideBar />
  <main>
    <HeaderApp />
    <RouterView />
    <FooterApp />
  </main>
  <AppRegisterGlobals />
</template>

<script setup lang="ts">
  import HeaderApp from '@/features/interface/layout/header/HeaderApp.vue'
  import SideBar from '@/features/interface/layout/sideBar/SideBar.vue'
  import AppRegisterGlobals from './AppRegisterGlobals.vue'
  import FooterApp from './features/interface/layout/footer/FooterApp.vue'
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
