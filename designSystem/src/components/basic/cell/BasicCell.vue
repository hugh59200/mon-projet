<template>
  <div :class="classes">
    <span v-if="text">{{ text }}</span>
    <slot v-else />

    <!-- 🔽 Icône dynamique -->
    <BasicIconNext
      v-if="iconName && resolvedIcon"
      :name="resolvedIcon"
      :color="iconColor"
      :size="iconSize"
      :pointer="!!onIconClick"
      @click="onIconClick && onIconClick()"
      class="ml-1 transition-transform duration-150"
    />
  </div>
</template>

<script setup lang="ts">
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'
  import type { IconColor } from '../icon'

  const props = withDefaults(
    defineProps<{
      text?: string
      span?: number
      center?: boolean
      danger?: boolean
      readonly?: boolean
      deactivated?: boolean
      extraClass?: string | string[]
      iconName?: IconNameNext
      iconColor?: IconColor
      iconSize?: number
      onIconClick?: () => void
      sortAsc?: boolean
      isActive?: boolean
    }>(),
    {
      center: false,
      danger: false,
      readonly: false,
      deactivated: false,
      span: 2,
      iconColor: 'neutral-400',
      iconSize: 16,
      sortAsc: undefined,
      isActive: false,
    },
  )

  const classes = computed(() => {
    const out: string[] = ['elem']
    if (props.center) out.push('elem--center')
    if (props.span) out.push(`elem--span-${props.span}`)
    if (props.danger) out.push('elem--danger')
    if (props.deactivated) out.push('elem--deactivated')
    if (props.readonly) out.push('elem--readonly')
    if (props.extraClass) {
      if (Array.isArray(props.extraClass)) out.push(...props.extraClass)
      else out.push(props.extraClass)
    }
    if (props.isActive) out.push('active')
    return out
  })

  const resolvedIcon = computed(() => {
    if (!props.isActive) return props.iconName
    return props.sortAsc ? 'ArrowUp' : 'ArrowDown'
  })
</script>

<style scoped lang="less">
  .elem.active {
    color: @primary-600;
  }
</style>
