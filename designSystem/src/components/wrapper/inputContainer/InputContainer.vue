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
    <!-- 👈 Icône gauche -->
    <BasicIconNext
      v-if="iconState === 'iconLeft' && iconName && inputType === 'form'"
      :name="iconName"
      :color="iconColor"
      :pointer="pointer"
    />

    <!-- 🧾 Champ -->
    <slot></slot>

    <!-- ⚠️ Alerte inline (si table) -->
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

    <!-- ❌ Icône “close” (suppression) -->
    <BasicIconNext
      v-if="deletable && !readonly && !disabled && modelValue"
      name="X"
      color="neutral-400"
      pointer
      @click="modelValue = null"
    />

    <!-- 👉 Icône droite -->
    <BasicIconNext
      v-if="inputType === 'form' && iconState === 'iconRight' && iconName"
      :name="iconName"
      :color="iconColor"
      :pointer="pointer"
    />
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import type {
    AlertInputProps,
    InputDateModel,
    InputDureeModel,
    InputNumberModel,
    InputProps,
    InputTelephoneModel,
  } from '@designSystem/components'
  import BasicAlert from '@designSystem/components/basic/alert/BasicAlert.vue'

  /* --- Props --- */
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
    iconColor: 'primary-600',
    pointer: false,
  })

  /* --- v-model --- */
  type InputModel = InputDateModel | InputDureeModel | InputTelephoneModel | InputNumberModel
  const modelValue = defineModel<InputModel>()

  /* --- Alerte --- */
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
