<template>
  <div ref="content"><slot></slot></div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { useHandleClickOutside } from '@/features/interface/composables/useHandleClickOutside'

  const content = ref()
  const emits = defineEmits<{
    (e: 'close', arg: MouseEvent): void
  }>()

  useHandleClickOutside(content, (event) => emits('close', event))
</script>

