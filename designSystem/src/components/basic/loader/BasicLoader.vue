<template>
  <div class="loader-wrapper">
    <div
      class="loader"
      :style="{
        width: sizeMap[size],
        height: sizeMap[size],
        borderWidth: borderWidthMap[size],
        borderColor: `${colorMap[color]}33`,
        borderTopColor: colorMap[color],
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      size?: 'small' | 'medium' | 'large'
      color?: 'primary' | 'neutral' | 'danger'
    }>(),
    {
      size: 'medium',
      color: 'primary',
    },
  )

  const sizeMap = {
    small: '18px',
    medium: '26px',
    large: '36px',
  }

  const borderWidthMap = {
    small: '2px',
    medium: '3px',
    large: '4px',
  }

  const colorMap = {
    primary: '#FFFFFF',
    neutral: '#999',
    danger: '#d32f2f',
  }
</script>

<style scoped lang="less">
  /* ✅ Toujours centré proprement */
  .loader-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    color: white;
  }

  .loader {
    color: white;
    border-radius: 50%;
    border-style: solid;
    border-color: transparent;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
