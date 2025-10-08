<template>
  <div :class="['alert', `alert--${alertType}`, `alert--${alertSize}`, { 'alert--no-bg': !hasBg }]">
    <BasicTooltip
      v-if="!hasLabel"
      :label="alertLabel!"
      :maxLength="alertMaxlength"
    >
      <BasicIcon
        :name="iconNameMapping[alertType]"
        active
      />
    </BasicTooltip>
    <template v-else>
      <div class="icon--container">
        <BasicIcon
          :name="iconNameMapping[alertType]"
          active
        />
      </div>

      <BasicText
        v-if="!$slots.label"
        :size="alertTextSizeMapping[alertSize]"
        :wrap
        class="alert--label"
      >
        {{ alertLabel }}
      </BasicText>
      <slot
        v-else
        name="label"
      ></slot>
    </template>
  </div>
</template>

<script setup lang="ts">
  import {
    type AlertInputProps,
    type AlertType,
    type IconName,
    type AlertSize,
    type TextSize,
  } from '@designSystem/components'

  withDefaults(defineProps<AlertInputProps>(), {
    hasBg: true,
    wrap: false,
    hasLabel: true,
    alertMaxlength: undefined,
    alertType: 'danger',
    alertSize: 'medium',
  })

  const iconNameMapping: Record<AlertType, IconName> = {
    warning: 'warning',
    danger: 'danger',
    success: 'tick-circle',
    info: 'info-circle',
  }

  const alertTextSizeMapping: Record<AlertSize, TextSize> = {
    small: 'body-s',
    medium: 'body-m',
  }
</script>

<style scoped lang="less">
  @import './BasicAlert.less';
</style>
