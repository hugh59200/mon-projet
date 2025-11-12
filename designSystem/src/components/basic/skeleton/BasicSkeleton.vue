<template>
  <div
    class="basic-skeleton"
    :style="{
      width,
      height,
      borderRadius,
      '--skeleton-color': color,
      '--skeleton-highlight': highlight,
    }"
  />
</template>

<script setup lang="ts">
  const props = defineProps<{
    width?: string
    height?: string
    borderRadius?: string
    color?: string
    highlight?: string
  }>()

  const width = props.width ?? '100%'
  const height = props.height ?? '16px'
  const borderRadius = props.borderRadius ?? '6px'
  const color = props.color ?? 'rgba(0,0,0,0.06)'
  const highlight = props.highlight ?? 'rgba(255,255,255,0.15)'
</script>

<style scoped lang="less">
  .basic-skeleton {
    position: relative;
    overflow: hidden;
    background: linear-gradient(
      90deg,
      var(--skeleton-color) 25%,
      var(--skeleton-highlight) 50%,
      var(--skeleton-color) 75%
    );
    background-size: 400% 100%;
    animation: shimmer 1.5s infinite linear;

    @keyframes shimmer {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }
  }
</style>
