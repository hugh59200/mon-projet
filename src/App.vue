<template>
  <AuthNavbar />
  <main>
    <RouterView />
  </main>
  <FooterApp />

  <!-- ✅ Conteneur global pour TOUS les toasts -->
  <ToastContainer />
</template>

<script setup lang="ts">
  import AuthNavbar from '@/features/auth/AuthNavbar.vue'
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import FooterApp from '@/features/interface/layout/footer/FooterApp.vue'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'

  const auth = useAuthStore()
</script>

<style scoped lang="less">
  @import '/src/assets/Mont/Mont.less';

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
