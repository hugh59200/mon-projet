<template>
  <Container
    class="page-content"
    :size="size"
    :padding="padding"
  >
    <slot></slot>
  </Container>
</template>

<script setup lang="ts">
import Container, {
  type ContainerSize,
  type ContainerPadding,
} from './Container.vue'

withDefaults(
  defineProps<{
    size?: ContainerSize
    padding?: ContainerPadding
  }>(),
  {
    size: 'lg',
    padding: 'lg',
  },
)
</script>

<style scoped lang="less">
.page-content {
  z-index: 1;
}
</style>
