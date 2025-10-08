<template>
  <div class="wrapper">
    <WrapperLabelHint
      :label
      :required
      :help
      :hint
      :wrapLabel
    >
      <template #label>
        <slot name="label"></slot>
      </template>
      <template #hint>
        <slot name="hint"></slot>
      </template>
    </WrapperLabelHint>

    <slot></slot>

    <BasicAlert
      v-if="alertLabel"
      class="wrapper__alert--container"
      @click="showAlert(alertLabel)"
      :alertLabel
      :alertType
      wrap
      :hasBg="false"
      alertSize="small"
    />
  </div>
</template>

<script setup lang="ts">
  import type { WrapperFormElementProps } from '@designSystem/components'
  import { useDialog } from '@/features/interface/dialog'

  withDefaults(defineProps<WrapperFormElementProps>(), {
    label: '',
    required: false,
    help: '',
    hint: '',
    alertMessage: '',
    alertType: 'danger',
    wrapLabel: true,
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
