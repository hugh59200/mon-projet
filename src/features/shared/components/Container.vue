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
    max-width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    flex: 1; /* Remplit l'espace disponible */
    display: flex;
    flex-direction: column;

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
      padding: 16px;

      .respond-mobile({
        padding: 12px;
      });
    }

    &--padding-md {
      padding: 24px;

      .respond-mobile({
        padding: 16px;
      });
    }

    &--padding-lg {
      padding: 32px;

      .respond-mobile({
        padding: 24px;
      });
    }

    // ========================================
    // Empêcher les enfants de déborder
    // ========================================
    > * {
      max-width: 100%;
      min-width: 0;
    }
  }
</style>
