<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel="touched ? internalAlertLabel || alertLabel : ''"
    :alertType="alertType"
    :help
  >
    <BasicInputPassword
      v-model="modelValue"
      :placeholder
      :disabled
      :size
      :readonly
      :maxlength
      :showStrength
      :minStrength
      :autoValidate
      :touched
      @strength-change="onStrengthChange"
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { AlertInputProps, InputModel, WrapperInputProps } from '@designSystem/components'
  import { ref, watch } from 'vue'

  withDefaults(
    defineProps<
      WrapperInputProps &
        AlertInputProps & {
          showStrength?: boolean
          minStrength?: 'weak' | 'medium' | 'strong'
          autoValidate?: boolean
          touched?: boolean
        }
    >(),
    {
      showStrength: true,
      minStrength: 'weak',
      autoValidate: true,
      touched: false,
    },
  )

  const modelValue = defineModel<InputModel>()

  const internalAlertLabel = ref('')
  const alertType = ref<'danger' | 'warning' | 'success' | 'info'>('danger')

  function onStrengthChange({ level, valid }: { level: string; valid: boolean }) {
    if (!modelValue.value || modelValue.value.toString().trim() === '') {
      internalAlertLabel.value = ''
      return
    }

    // ✅ si weak, ne rien afficher
    if (level === 'weak') {
      internalAlertLabel.value = ''
      return
    }

    if (valid) {
      internalAlertLabel.value = ''
      alertType.value = 'success'
    } else {
      // ✅ Si faible → aucune alerte
      if (level === 'weak') {
        internalAlertLabel.value = ''
        return
      }

      // ✅ Moyen → petit warning
      if (level === 'medium') {
        internalAlertLabel.value = 'Mot de passe à renforcer'
        alertType.value = 'warning'
      }
    }
  }

  watch(modelValue, (val) => {
    if (!val || val.toString().trim() === '') {
      internalAlertLabel.value = ''
      alertType.value = 'danger'
    }
  })
</script>
