<template>
  <div class="toast-container">
    <component
      v-for="t in toastStore.toasts"
      :key="t.id"
      :is="t.component || BasicToast"
      v-bind="t.props"
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
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 2500;
    pointer-events: none;
  }
  .toast-container > * {
    pointer-events: auto;
  }
</style>
