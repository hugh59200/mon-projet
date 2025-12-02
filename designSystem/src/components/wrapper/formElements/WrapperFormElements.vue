<template>
  <div class="wrapper">
    <WrapperLabelHint
      :label
      :required
      :help
      :hint
    >
      <template #label>
        <slot name="label"></slot>
      </template>
      <template #hint>
        <slot name="hint"></slot>
      </template>
    </WrapperLabelHint>
    <slot></slot>

    <!-- Alert avec animation premium -->
    <Transition name="field-alert">
      <div
        v-if="alertLabel"
        :class="['wrapper__alert', `wrapper__alert--${alertType}`]"
        role="alert"
        aria-live="polite"
        @click="showAlert(alertLabel)"
      >
        <span class="wrapper__alert-icon">
          <svg
            v-if="alertType === 'danger'"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <svg
            v-else-if="alertType === 'warning'"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <svg
            v-else-if="alertType === 'success'"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <svg
            v-else
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        </span>
        <span class="wrapper__alert-message">{{ alertLabel }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import type { WrapperFormElementProps } from '@designSystem/components'

  withDefaults(defineProps<WrapperFormElementProps>(), {
    label: '',
    required: false,
    help: '',
    hint: '',
    alertLabel: '',
    alertType: 'danger',
  })

  const showAlert = (message: string) => {
    const dialog = useDialog()
    dialog.showDialog({
      message,
      type: 'Error',
      closable: true,
    })
  }
</script>

<style lang="less">
  @import './WrapperFormElements.less';
</style>
