<template>
  <div :class="rootClasses">
    <!-- Icon left (si iconState === 'iconLeft') -->
    <BasicIconNext
      v-if="shouldShowLeftIcon"
      :name="iconName"
      :color="iconColor"
      :size="16"
      :pointer="pointer"
      class="input-container__icon-left"
    />

    <!-- Field slot -->
    <div class="input-container__field">
      <slot></slot>
    </div>

    <!-- Delete icon -->
    <BasicIconNext
      v-if="deletable && !readonly && !disabled && modelValue"
      name="X"
      :color="'danger-600'"
      pointer
      :size="16"
      @click="clearValue"
      class="input-container__icon-delete"
    />

    <!-- Icon right (slot prioritaire) -->
    <div
      v-if="$slots['icon-right']"
      class="input-container__icons-right"
    >
      <slot name="icon-right"></slot>
    </div>

    <!-- Icon right fallback -->
    <BasicIconNext
      v-else-if="shouldShowRightIcon"
      :name="iconName"
      :color="iconColor"
      :size="16"
      :pointer="pointer"
      class="input-container__icon-right"
    />

    <!-- Alert (table mode only) -->
    <BasicAlert
      v-if="inputType === 'table' && alertLabel"
      class="input-container__alert"
      @click="showAlert(alertLabel)"
      :alertLabel="alertLabel"
      :alertType="alertType"
      :alertMaxlength="50"
      wrap
      :has-label="false"
      :hasBg="false"
    />
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import { computed } from 'vue'

  import type {
    AlertInputProps,
    IconColor,
    InputDateModel,
    InputDureeModel,
    InputNumberModel,
    InputProps,
    InputTelephoneModel,
  } from '@designSystem/components'

  /* ------------------------------------------------------------
   Props
------------------------------------------------------------ */
  const props = withDefaults(defineProps<InputProps & AlertInputProps>(), {
    size: 'medium',
    iconState: 'iconRight',
    iconName: undefined,
    deletable: false,
    readonly: false,
    disabled: false,
    inputType: 'form',
    hasBg: true,
    wrap: false,
    hasLabel: true,
    iconColor: 'neutral-600' as IconColor,
    pointer: false,
  })

  /* ------------------------------------------------------------
   v-model
------------------------------------------------------------ */
  type InputModel =
    | InputDateModel
    | InputTelephoneModel
    | InputDureeModel
    | InputNumberModel
    | string
    | null

  const modelValue = defineModel<InputModel>()

  /* ------------------------------------------------------------
   Computed : classes racines
------------------------------------------------------------ */
  const rootClasses = computed(() => [
    'input-container',
    `input-container--${props.size}`,
    `input-container--${props.inputType}`,
    {
      'input-container--error': props.validationState === 'error',
      'input-container--success': props.validationState === 'success',
      'input-container--disabled': props.disabled,
      'input-container--readonly': props.readonly,
      'input-container--has-left-icon': shouldShowLeftIcon.value,
      'input-container--has-right-icon': shouldShowRightIcon.value,
    },
  ])

  /* ------------------------------------------------------------
   Icônes
------------------------------------------------------------ */
  const shouldShowLeftIcon = computed(
    () => props.iconState === 'iconLeft' && props.iconName && props.inputType === 'form',
  )

  const shouldShowRightIcon = computed(
    () => props.iconState === 'iconRight' && props.iconName && props.inputType === 'form',
  )

  /* ------------------------------------------------------------
   Efface la valeur
------------------------------------------------------------ */
  const clearValue = () => {
    modelValue.value = null
  }

  /* ------------------------------------------------------------
   Alert table
------------------------------------------------------------ */
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
