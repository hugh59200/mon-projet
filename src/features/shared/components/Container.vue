<template>
  <div
    class="container"
    :class="[`container--${size}`, `container--padding-${padding}`]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'
  export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg'

  withDefaults(
    defineProps<{
      size?: ContainerSize
      padding?: ContainerPadding
    }>(),
    {
      size: 'lg',
      padding: 'md',
    },
  )
</script>

<style scoped lang="less">
  .container {
    position: relative;
    width: 100%;
    max-width: 100%; // Empêche le débordement
    margin: 0 auto;
    overflow: hidden; // Évite le scroll horizontal

    // ========================================
    // SIZES (max-width)
    // ========================================
    &--sm {
      max-width: min(720px, 100%);
    }

    &--md {
      max-width: min(960px, 100%);
    }

    &--lg {
      max-width: min(1200px, 100%);
    }

    &--xl {
      max-width: min(1400px, 100%);
    }

    &--full {
      max-width: 100%;
    }

    // ========================================
    // PADDING
    // ========================================
    &--padding-none {
      padding: 0;
    }

    &--padding-sm {
      padding: 16px 16px 40px;

      @media (max-width: 768px) {
        padding: 12px 12px 32px;
      }
    }

    &--padding-md {
      padding: 24px 24px 60px;

      @media (max-width: 768px) {
        padding: 16px 16px 48px;
      }
    }

    &--padding-lg {
      padding: 32px 24px 80px;

      @media (max-width: 768px) {
        padding: 24px 16px 60px;
      }
    }
  }
</style>
