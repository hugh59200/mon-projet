<template>
  <div :class="[...classes, { 'is-active': isActive }]">
    <!-- Texte ou slot -->
    <span
      v-if="text"
      class="truncate"
    >
      {{ text }}
    </span>
    <slot v-else />

    <!-- Icône de tri animée -->
    <transition
      name="fade-rotate"
      mode="out-in"
    >
      <BasicIconNext
        v-if="iconName"
        :key="iconName + (sortAsc ? '-asc' : '-desc')"
        :name="resolvedIcon"
        :color="isActive ? 'primary-600' : iconColor"
        :size="iconSize"
        :pointer="!!onIconClick"
        @click="onIconClick && onIconClick()"
        class="basic-cell__icon ml-1"
      />
    </transition>

    <!-- Barre d’indicateur active -->
    <div
      v-if="isActive"
      class="basic-cell__active-indicator"
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
      iconColor: 'grey-800',
      iconSize: 16,
      sortAsc: undefined,
      isActive: false,
    },
  )

  const classes = computed(() => {
    const out: string[] = ['elem', 'basic-cell']
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

  /* 🌀 Gestion dynamique de l’icône selon sens du tri */
  const resolvedIcon = computed(() => {
    if (!props.iconName) return 'ArrowUpDown'
    if (props.sortAsc === undefined) return props.iconName
    return props.sortAsc ? 'ArrowUp' : 'ArrowDown'
  })
</script>

<style scoped lang="less">
  .basic-cell {
    position: relative;
    cursor: default;
    user-select: none;
    transition: color 0.2s ease;

    &:hover {
      color: @primary-700;
    }

    /* Flèche de tri */
    .basic-cell__icon {
      transition:
        transform 0.25s ease,
        color 0.25s ease,
        opacity 0.25s ease;
      opacity: 0.75;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
        color: @primary-600;
      }
    }

    /* Barre animée */
    .basic-cell__active-indicator {
      position: absolute;
      bottom: -4px;
      left: 20%;
      right: 20%;
      height: 2px;
      border-radius: 2px;
      background: @primary-500;
      transform: scaleX(0);
      opacity: 0;
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
    }

    &.is-active .basic-cell__active-indicator {
      transform: scaleX(1);
      opacity: 1;
    }
  }

  /* Animation morph pour l’icône */
  .fade-rotate-enter-active,
  .fade-rotate-leave-active {
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }
  .fade-rotate-enter-from {
    opacity: 0;
    transform: rotate(-90deg) scale(0.85);
  }
  .fade-rotate-enter-to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  .fade-rotate-leave-from {
    opacity: 1;
    transform: rotate(0deg) scale(1);
  }
  .fade-rotate-leave-to {
    opacity: 0;
    transform: rotate(90deg) scale(0.85);
  }
</style>
