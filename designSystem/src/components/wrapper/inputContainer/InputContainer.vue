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
      class="input-container__icon-left"
    />

    <!-- 🧾 Champ principal -->
    <div class="input-container__field">
      <slot></slot>
    </div>

    <!-- 🧩 Icônes droites empilables -->
    <div
      v-if="$slots['icon-right'] || showRightIcons"
      class="input-container__icons-right"
    >
      <slot name="icon-right"></slot>
    </div>

    <!-- ⚠️ Alerte inline (si mode table) -->
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
      :color="'danger-600' as IconColor"
      pointer
      @click="modelValue = null"
      class="input-container__icon-delete"
    />

    <!-- 👉 Icône droite par défaut (fallback) -->
    <BasicIconNext
      v-if="!$slots['icon-right'] && inputType === 'form' && iconState === 'iconRight' && iconName"
      :name="iconName"
      :color="iconColor"
      :pointer="pointer"
      class="input-container__icon-fallback"
    />
  </div>
</template>

<script setup lang="ts">
  import { useDialog } from '@/features/interface/dialog'
  import type {
    AlertInputProps,
    IconColor,
    InputDateModel,
    InputDureeModel,
    InputNumberModel,
    InputProps,
    InputTelephoneModel,
  } from '@designSystem/components'
  import BasicAlert from '@designSystem/components/basic/alert/BasicAlert.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'

  /* --- Props --- */
  const props = withDefaults(defineProps<InputProps & AlertInputProps>(), {
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
