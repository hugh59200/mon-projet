<template>
  <div
    class="page-content"
    :class="[
      `page-content--${size}`,
      { 'page-content--no-padding-top': noPaddingTop },
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
export type PageContentSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

withDefaults(
  defineProps<{
    size?: PageContentSize
    noPaddingTop?: boolean
  }>(),
  {
    size: 'lg',
    noPaddingTop: false,
  },
)
</script>

<style scoped lang="less">
.page-content {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0 auto;
  padding: 32px 24px 80px;

  // Sizes
  &--sm {
    max-width: 720px;
  }

  &--md {
    max-width: 960px;
  }

  &--lg {
    max-width: 1200px;
  }

  &--xl {
    max-width: 1400px;
  }

  &--full {
    max-width: none;
  }

  // Modifiers
  &--no-padding-top {
    padding-top: 0;
  }

  // Responsive
  @media (max-width: 768px) {
    padding: 24px 16px 60px;
  }
}
</style>
