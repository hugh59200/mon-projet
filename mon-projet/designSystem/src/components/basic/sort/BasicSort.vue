<template>
  <div class="basic-sort">
    <BasicIcon
      @click="updateModelValue"
      :class="'basic-sort__' + iconName"
      :name="iconName"
      active
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { SortProps } from './BasicSort.types'

  const props = withDefaults(defineProps<SortProps>(), {
    name: '',
  })

  const modelValue = defineModel<string>()

  const iconName = computed(() => {
    if (modelValue?.value?.includes(props.name)) {
      return modelValue.value.includes('asc') ? 'arrow-up' : 'arrow-down'
    }
    return 'arrow-up-down'
  })

  const updateModelValue = () => {
    modelValue.value =
      modelValue?.value?.includes(props.name) && modelValue?.value?.includes('asc')
        ? props.name + ' desc'
        : props.name + ' asc'
  }
</script>

<style lang="less">
  @import './BasicSort.less';
</style>
