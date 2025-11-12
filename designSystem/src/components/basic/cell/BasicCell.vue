<template>
  <div :class="classes">
    <BasicText v-if="text">{{ text }}</BasicText>
    <slot v-else />

    <BasicIconNext
      v-if="isSortable"
      :name="resolvedIcon"
      :color="iconColor"
      :size="iconSize"
      pointer
      @click.stop="onIconClick && onIconClick()"
      class="elem__sort-icon"
    />
  </div>
</template>

<script setup lang="ts">
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
      onIconClick?: () => void
      sortAsc?: boolean
      isActive?: boolean
      iconColor?: IconColor
      iconSize?: number
    }>(),
    {
      center: false,
      danger: false,
      readonly: false,
      deactivated: false,
      span: 2,
      iconColor: 'neutral-400' as IconColor,
      iconSize: 16,
      sortAsc: undefined,
      isActive: false,
    },
  )

  const isSortable = computed(() => typeof props.onIconClick === 'function')

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
    if (isSortable.value) out.push('elem--clickable', 'elem--sort')

    return out
  })

  const resolvedIcon = computed(() => {
    if (!props.isActive) return 'ArrowUpDown'
    return props.sortAsc ? 'ArrowUp' : 'ArrowDown'
  })
</script>

<style scoped lang="less">
  .elem {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.15s ease;

    &--clickable {
      cursor: pointer;
      user-select: none;
    }

    &--sort:hover {
      color: @primary-600;
    }

    &.active {
      color: @primary-600;
      font-weight: 600;
    }

    &__sort-icon {
      transition: transform 0.15s ease;
    }

    &.active &__sort-icon {
      transform: translateY(-1px);
    }
  }
</style>
