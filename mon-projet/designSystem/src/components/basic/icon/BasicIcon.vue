<template>
  <component
    v-if="loadedIcon"
    :is="loadedIcon"
    v-focusable="{ focusable }"
    :class="[
      'icon',
      { show: isVisible },
      { 'icon--disabled': disabled },
      { 'icon--not-allowed': disabled && !pointer },
      { [`icon--color--${color}`]: !disabled ? color : undefined, 'icon--pointer': pointer },
    ]"
  />
</template>

<script setup lang="ts">
  import { defineAsyncComponent, ref, watch, shallowRef } from 'vue'
  import type { IconProps } from './BasicIcon.type'
  import { loadIcon } from './useIconLoader'

  const props = withDefaults(defineProps<IconProps>(), {
    active: false,
    focusable: false,
    pointer: false,
    disabled: false,
  })

  const isVisible = ref(false)
  const loadedIcon = shallowRef<ReturnType<typeof defineAsyncComponent> | null>(null)

  const loadSvgComponent = async () => {
    isVisible.value = false
    const type = props.active ? 'bold' : 'outline'
    loadedIcon.value = defineAsyncComponent(() => loadIcon(type, props.name!))

    await new Promise((resolve) => setTimeout(resolve, 10))
    isVisible.value = true
  }

  watch(() => [props.name, props.active], loadSvgComponent, { immediate: true })
</script>

<style lang="less" scoped>
  @import './BasicIcon.less';
</style>
