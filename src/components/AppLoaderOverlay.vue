<template>
  <Teleport to="body">
    <Transition name="loader-fade">
      <div
        v-if="isLoading"
        class="app-loader-overlay"
      >
        <div class="app-loader-content">
          <div class="loader-spinner"></div>
          <span
            v-if="message"
            class="loader-message"
          >
            {{ message }}
          </span>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { useAppLoader } from '@/composables/useAppLoader'

  const { isLoading, message } = useAppLoader()
</script>

<style scoped lang="less">
  .app-loader-overlay {
    position: fixed;
    inset: 0;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(4px);
  }

  .app-loader-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .loader-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(var(--primary-500-rgb), 0.15);
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  .loader-message {
    font-size: 0.9rem;
    font-weight: 500;
    color: #64748b;
    letter-spacing: 0.3px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Transition */
  .loader-fade-enter-active,
  .loader-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .loader-fade-enter-from,
  .loader-fade-leave-to {
    opacity: 0;
  }
</style>
