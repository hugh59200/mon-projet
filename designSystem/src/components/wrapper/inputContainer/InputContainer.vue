<template>
  <div
    :class="[
      'input-container',
      `input-container--${inputType}`,
      `input-container--${size}`,
      {
        'input-container--disabled': disabled,
        'input-container--readonly': readonly,
        'input-container--success': validationState === 'success',
        'input-container--error': validationState === 'error',
      },
    ]"
  >
    <BasicIcon
      v-if="iconState === 'iconLeft' && iconName && inputType === 'form'"
      :name="iconName"
    />
    <slot></slot>
    <BasicAlert
      v-if="inputType === 'table' && alertLabel"
      :class="[`input-container--${inputType}--alert`]"
      @click="showAlert(alertLabel)"
      :alertLabel
      :alertType
      :alertMaxlength="50"
      wrap
      :has-label="false"
      :hasBg="false"
    />
    <BasicIcon
      v-if="deletable && !readonly && !disabled && modelValue"
      name="close"
      @click="modelValue = null"
    />
    <BasicIcon
      v-if="inputType === 'form' && iconState === 'iconRight' && iconName"
      :name="iconName"
      :class="[`input-container--${inputType}--alert`]"
    />
  </div>
</template>

<script setup lang="ts">
  import type {
    AlertInputProps,
    InputDateModel,
    InputDureeModel,
    InputNumberModel,
    InputProps,
    InputTelephoneModel,
  } from '@designSystem/components'
  import { useDialog } from '@/features/interface/dialog'

  withDefaults(defineProps<InputProps & AlertInputProps>(), {
    size: 'medium',
    iconName: undefined,
    iconState: 'iconRight',
    deletable: false,
    readonly: false,
    disabled: false,
    inputType: 'form',
    hasBg: true,
    wrap: false,
    hasLabel: true,
    alertMaxlength: undefined,
  })

  type InputModel = InputDateModel | InputDureeModel | InputTelephoneModel | InputNumberModel | InputDateModel

  const modelValue = defineModel<InputModel>()

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
  @import './InputContainer.less';
</style>
