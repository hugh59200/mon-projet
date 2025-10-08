<template>
  <component
    :is="inline ? 'div' : BasicCell"
    v-bind="
      !inline
        ? {
            center,
            span,
            danger,
            readonly,
            deactivated,
            extraClass,
          }
        : {}
    "
  >
    <span v-if="inline">{{ label }} :</span>
    <BasicTooltip :label="tooltipToShow!">
      <BasicIcon
        :name="iconName"
        :focusable="!isDisabled"
        :pointer="!isDisabled"
        :disabled="isDisabled"
        @click="onClick"
      />
    </BasicTooltip>
  </component>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import BasicCell from './BasicCell.vue'
  import BasicTooltip from '@designSystem/components/basic/tooltip/BasicTooltip.vue'
  import BasicIcon from '@designSystem/components/basic/icon/BasicIcon.vue'
  import type { BasicCellActionIconProps } from './BasicCellActionIcon.types'

  const props = withDefaults(defineProps<BasicCellActionIconProps>(), {
    inline: false,
    disabled: false,
  })

  const isDisabled = computed(() => props.disabled || props.readonly)

  const tooltipToShow = computed(() => (isDisabled.value ? props.disabledTooltip : props.tooltip))

  const emit = defineEmits<{ (e: 'click'): void }>()

  const onClick = (e: MouseEvent) => {
    if (isDisabled.value) return
    ;(e.currentTarget as HTMLElement)?.blur?.()
    emit('click')
  }
</script>
<style scoped lang="less">
  .elem {
    svg {
      fill: @primary-600;
    }

    &:not(.elem--readonly)&--danger {
      svg {
        fill: @danger-600;
      }
    }

    &--deactivated {
      svg {
        fill: @neutral-300;
      }
    }
  }

  .link :deep(.text) {
    font-weight: bolder;
  }
  .sous-titre {
    font-size: 10px;
    font-weight: bold;
  }
</style>
