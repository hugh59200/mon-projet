<template>
  <DialogComponent />
  <ToastContainer />
  <CGU />
  <ChatWidget v-if="auth.user && !isAdmin" />
  <transition name="fade">
    <div
      v-if="cgu.overlayActive"
      class="cgu-overlay"
    />
  </transition>
</template>

<script setup lang="ts">
  import { useAuthStore } from '@/features/auth/useAuthStore'
  import { registerPopupAutoCGU } from '@/features/interface/cgu'
  import CGU from '@/features/interface/cgu/CGU.vue'
  import { useAfficheCGUStore } from '@/features/interface/cgu/useAfficheCGUStore'
  import DialogComponent from '@/features/interface/dialog/components/DialogComponent.vue'
  import ToastContainer from '@designSystem/components/basic/toast/ToastContainer.vue'
  import { computed } from 'vue'
  import ChatWidget from './features/admin/chat/user/ChatWidget.vue'

  /* -------------------------------------------------------------------------- */
  /*                                 INITIALISATION                             */
  /* -------------------------------------------------------------------------- */
  registerPopupAutoCGU()

  const cgu = useAfficheCGUStore()
  const auth = useAuthStore()

  const isAdmin = computed(() => auth.user?.role === 'admin')
</script>

<style lang="less">
  /* ✨ Overlay CGU (flou + fondu) */
  .cgu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: fade(black, 40%);
    backdrop-filter: blur(6px);
    z-index: 800; /* sous le Modal mais au-dessus du reste */
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

  /* ✨ Transition fade globale */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
