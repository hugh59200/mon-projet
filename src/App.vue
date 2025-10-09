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
  import FooterApp from './features/interface/layout/footer/FooterApp.vue'
  import AppRegisterGlobals from './AppRegisterGlobals.vue'
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  .envBox {
    right: 10px;
    bottom: 10px;
    position: absolute;
    padding: 12px;
    border: solid 2px red;
    border-radius: 8px;
  }

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
