<template>
  <div class="app-layout">
    <AuthNavbar />

    <div
      class="app-body"
      :class="{ 'sidebar-open': sidebar.isOpen }"
    >
      <SidebarApp />

      <main class="app-main">
        <RouterView />
      </main>
    </div>

    <FooterApp />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
  import AuthNavbar from '@/features/auth/AuthNavbar.vue'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import SidebarApp from '@/features/interface/layout/sideBar/SidebarApp.vue'
  import { useSidebarStore } from '@/features/interface/layout/sideBar/useSidebarStore'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'

  const sidebar = useSidebarStore()
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  .app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .app-body {
    display: flex;
    flex: 1;
    transition: margin-left 0.3s ease;
    margin-left: 60px; // largeur minimale (sidebar fermée)
  }

  .app-body.sidebar-open {
    margin-left: 220px; // largeur ouverte
  }

  .app-main {
    flex: 1;
    padding: 24px 40px;
    background: white;
    transition: all 0.3s ease;
    overflow-y: auto;
  }

  @media (max-width: 900px) {
    .app-body {
      margin-left: 0;
    }
  }
</style>
