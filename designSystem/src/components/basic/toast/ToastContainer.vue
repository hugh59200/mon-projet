<template>
  <div class="toast-container">
    <BasicToast
      v-for="t in toastStore.toasts"
      :key="t.id"
      :id="t.id"
      :message="t.message"
      :type="t.type"
      :duration="t.duration"
    />
  </div>
</template>

<script setup lang="ts">
  import { useToastStore } from '@designSystem/components/basic/toast/useToastStore'
  import BasicToast from './BasicToast.vue'

  const toastStore = useToastStore()
</script>

<style scoped lang="less">
  .toast-container {
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 2000;
    pointer-events: none; // évite de bloquer les clics sur la page
  }

  .toast-container > * {
    pointer-events: auto; // réactive les clics sur les boutons ✖
  }
</style>
