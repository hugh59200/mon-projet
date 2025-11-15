<template>
  <div class="pill-group">
    <BasicPill
      v-for="opt in options"
      :key="opt.value"
      :label="opt.label"
      :active="modelValue === opt.value"
      :size="size"
      @click="modelValue = opt.value"
    />
  </div>
</template>

<script setup lang="ts">
import BasicPill from './BasicPill.vue'

const props = withDefaults(defineProps<{
  modelValue: string | number
  options: Array<{ label: string; value: string | number }>
  size?: 'small' | 'medium'
}>(), {
  size: 'medium',
})

const modelValue = defineModel<string | number>()
</script>

<style lang="less" scoped>
.pill-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
