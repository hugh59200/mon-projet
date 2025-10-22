<template>
  <div
    class="loader"
    :style="{
      width: sizeMap[size],
      height: sizeMap[size],
      borderColor: `${colorMap[color]}40`,
      borderTopColor: colorMap[color],
    }"
  ></div>
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
    small: '20px',
    medium: '28px',
    large: '40px',
  }

  const colorMap = {
    primary: '#00796b',
    neutral: '#999',
    danger: '#d32f2f',
  }
</script>

<style lang="less">
  .loader {
    border: 3px solid transparent;
    border-top: 3px solid #00796b;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
