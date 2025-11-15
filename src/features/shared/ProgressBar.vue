<template>
  <div
    class="progress-container"
    :class="color"
  />
</template>

<script setup lang="ts">
  defineProps<{ color?: 'success' | 'primary' | 'danger' }>()
</script>

<style scoped lang="less">
  .progress-container {
    position: relative;
    width: 140px;
    height: 6px;
    background: rgba(var(--neutral-300-rgb), 0.40);
    border-radius: 6px;
    overflow: hidden;
    margin-top: 28px;
    box-shadow: inset 0 0 3px rgba(var(--neutral-900-rgb), 0.08);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 6px;
      transform: translateX(-100%);
      animation: loadbar 3.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      background-size: 200% auto;
    }

    /* ✅ Couleurs dynamiques */
    &.success::after {
      background: linear-gradient(90deg, @success-500, lighten(@success-600, 10%), @success-500);
    }

    &.primary::after {
      background: linear-gradient(90deg, @primary-500, lighten(@primary-600, 10%), @primary-500);
    }

    &.danger::after {
      background: linear-gradient(90deg, @danger-500, lighten(@danger-600, 10%), @danger-500);
    }

    /* ✨ Effet de brillance subtile */
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -40%;
      width: 40%;
      height: 100%;
      background: rgba(255, 255, 255, 0.25);
      transform: skewX(-20deg);
      animation: shine 1.8s ease-in-out infinite;
      pointer-events: none;
    }
  }

  /* Animation principale du remplissage */
  @keyframes loadbar {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }

  /* Animation du reflet brillant */
  @keyframes shine {
    0% {
      left: -40%;
    }
    100% {
      left: 140%;
    }
  }
</style>
