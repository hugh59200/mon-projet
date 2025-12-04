<template>
  <DialogComponent />
  <ToastContainer />
  <ChatWidget v-if="isAuthenticated && role === 'user'" />
  <CatalogueDock />
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/stores/useAuthStore'
  import DialogComponent from '@/features/interface/dialog/components/DialogComponent.vue'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'
  import { storeToRefs } from 'pinia'
  import ChatWidget from '@/features/chat/user/ChatWidget.vue'
  import CatalogueDock from '@/features/shared/components/CatalogueDock.vue'

  const auth = useAuthStore()

  const { role, isAuthenticated } = storeToRefs(auth)
</script>

<style lang="less">
  .cgu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: fade(black, 40%);
    backdrop-filter: blur(6px);
    z-index: 800;
    animation: fadeInOverlay 0.3s ease forwards;
  }

  @keyframes fadeInOverlay {
    from {
      opacity: 0;
      backdrop-filter: blur(0);
    }
    to {
      opacity: 1;
      backdrop-filter: blur(6px);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
