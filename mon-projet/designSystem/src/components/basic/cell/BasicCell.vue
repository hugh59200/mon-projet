<template>
  <div :class="classes">
    <span v-if="text">{{ text }}</span>
    <slot v-else />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BasicCellProps } from './BasicCell.types'

  const props = withDefaults(defineProps<BasicCellProps & { text?: string }>(), {
    center: false,
    danger: false,
    readonly: false,
    deactivated: false,
    span: 2,
  })

  const classes = computed(() => {
    const out: Array<string> = ['elem']
    if (props.center) out.push('elem--center')
    if (props.span) out.push(`elem--span-${props.span}`)
    if (props.danger) out.push('elem--danger')
    if (props.deactivated) out.push('elem--deactivated')
    if (props.readonly) out.push('elem--readonly')
    if (props.extraClass) {
      if (Array.isArray(props.extraClass)) out.push(...props.extraClass)
      else out.push(props.extraClass)
    }
    return out
  })
</script>
