<template>
  <div
    :class="[
      'input-container',
      `input-container--${props.inputType}`,
      `input-container--${props.size}`,
      props.variant !== 'default' ? `input-container--${props.variant}` : '',
      {
        'input-container--disabled': props.disabled,
        'input-container--readonly': props.readonly,
        'input-container--success': props.validationState === 'success',
        'input-container--error': props.validationState === 'error',
      },
    ]"
  >
    <BasicIconNext
      v-if="iconState === 'iconLeft' && iconName && inputType === 'form'"
      :name="iconName"
      :color="iconColor"
      :pointer="pointer"
      :size="16"
      class="input-container__icon-left"
    />
    <div class="input-container__field">
      <slot></slot>
    </div>
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
    <BasicIconNext
      v-if="deletable && !readonly && !disabled && modelValue"
      name="X"
      :color="'danger-600' as IconColor"
      pointer
      :size="16"
      @click="modelValue = null"
      class="input-container__icon-delete"
    />
    <div v-if="$slots['icon-right'] || showRightIcons">
      <slot name="icon-right"></slot>
    </div>
    <BasicIconNext
      v-if="!$slots['icon-right'] && inputType === 'form' && iconState === 'iconRight' && iconName"
      :name="iconName"
      :color="iconColor"
      :pointer="pointer"
      :size="16"
      class="input-container__icon-fallback"
    />
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import type { AlertInputProps, IconColor, InputProps } from '@designSystem/components'
  import BasicAlert from '@designSystem/components/basic/alert/BasicAlert.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'

  /* --- Props --- */
  const props = withDefaults(defineProps<InputProps & AlertInputProps>(), {
    size: 'medium',
    variant: 'default',
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
    iconColor: undefined, // Pas de couleur par défaut → hérite de var(--text-muted) via CSS
    pointer: false,
  })

  /* --- v-model --- */
  type InputContainerModel = string | number | null | undefined
  const modelValue = defineModel<InputContainerModel>()

  /* --- Détection de slot droit --- */
  const showRightIcons = computed(() => !!(props.iconState === 'iconRight' && props.iconName))

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
