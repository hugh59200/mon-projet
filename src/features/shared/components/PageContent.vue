<template>
  <Container
    class="page-content"
    :class="[`page-content--${direction}`]"
    :size="size"
    :padding="padding"
  >
    <slot></slot>
  </Container>
</template>

<script setup lang="ts">
  import Container, { type ContainerPadding, type ContainerSize } from './Container.vue'

  withDefaults(
    defineProps<{
      size?: ContainerSize
      padding?: ContainerPadding
      direction?: 'column' | 'row'
    }>(),
    {
      size: 'lg',
      padding: 'lg',
      direction: 'column',
    },
  )
</script>

<style scoped lang="less">
  .page-content {
    z-index: 1;
    display: flex;
    flex: 1; /* Remplit l'espace disponible */
    gap: 32px;

    &--column {
      flex-direction: column;
    }

    &--row {
      flex-direction: row;
      align-items: flex-start;
    }
  }
</style>
