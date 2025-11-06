<template>
  <div
    class="progress-container"
    :class="color"
  />
</template>

<script setup lang="ts">
  defineProps<{ color?: 'success' | 'primary' }>()
</script>

<style scoped lang="less">
  .progress-container {
    position: relative;
    width: 120px;
    height: 6px;
    background: #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
    margin-top: 24px;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      transform: translateX(-100%);
      animation: loadbar 3s linear forwards;
    }

    &.success::after {
      background: @success-500;
    }

    &.primary::after {
      background: @primary-500;
    }
  }

  @keyframes loadbar {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
</style>
