<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel="computedAlertLabel"
    :alertType="computedAlertType"
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
      :deletable
      :autocomplete
      @strength-change="onStrengthChange"
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { AlertInputProps, InputModel, WrapperInputProps } from '@designSystem/components'
  import { ref, watch, computed } from 'vue'

  const props = withDefaults(
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
      alertLabel: '',
      alertType: 'danger',
    },
  )

  const modelValue = defineModel<InputModel>()

  const internalAlertLabel = ref('')
  const internalAlertType = ref<'danger' | 'warning' | 'success' | 'info'>('danger')

  // Priorité: alertLabel externe > internalAlertLabel (force du mot de passe)
  const computedAlertLabel = computed(() => {
    // Si une alerte externe est passée, l'utiliser
    if (props.alertLabel) {
      return props.alertLabel
    }
    // Sinon, utiliser l'alerte interne de force de mot de passe (si touched)
    if (props.touched && internalAlertLabel.value) {
      return internalAlertLabel.value
    }
    return ''
  })

  const computedAlertType = computed(() => {
    // Si une alerte externe est passée, utiliser son type
    if (props.alertLabel) {
      return props.alertType
    }
    // Sinon, utiliser le type interne
    return internalAlertType.value
  })

  function onStrengthChange({ level, valid }: { level: string; valid: boolean }) {
    if (!modelValue.value || modelValue.value.toString().trim() === '') {
      internalAlertLabel.value = ''
      return
    }

    // Si weak, ne rien afficher
    if (level === 'weak') {
      internalAlertLabel.value = ''
      return
    }

    if (valid) {
      internalAlertLabel.value = ''
      internalAlertType.value = 'success'
    } else {
      // Si faible → aucune alerte
      if (level === 'weak') {
        internalAlertLabel.value = ''
        return
      }

      // Moyen → petit warning
      if (level === 'medium') {
        internalAlertLabel.value = 'Mot de passe à renforcer'
        internalAlertType.value = 'warning'
      }
    }
  }

  watch(modelValue, (val) => {
    if (!val || val.toString().trim() === '') {
      internalAlertLabel.value = ''
      internalAlertType.value = 'danger'
    }
  })
</script>
