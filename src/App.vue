<template>
  <div class="app-layout">
    <AuthNavbar />
    <SidebarApp />
    <main class="app-main">
      <RouterView />
    </main>
    <FooterApp />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
  import AuthNavbar from '@/features/auth/AuthNavbar.vue'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import SidebarApp from '@/features/interface/layout/sideBar/SidebarApp.vue'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';
  .app-layout {
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 24px 40px;
    overflow-y: auto;
    background: white;
  }

  @media (max-width: 900px) {
    .app-content {
      margin-left: 0;
      margin-bottom: 60px;
    }
  }
</style>
