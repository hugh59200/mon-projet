<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel="touched ? alertLabel : ''"
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

  /**
   * ✅ Props : wrapper générique + options spécifiques au mot de passe
   */
  const props = withDefaults(
    defineProps<
      WrapperInputProps &
        AlertInputProps & {
          showStrength?: boolean
          minStrength?: 'weak' | 'medium' | 'strong'
          autoValidate?: boolean
          touched?: boolean // 👈 nouvelle prop
        }
    >(),
    {
      showStrength: true,
      minStrength: 'weak',
      autoValidate: true,
      touched: false,
    },
  )

  /**
   * 🔗 v-model du mot de passe
   */
  const modelValue = defineModel<InputModel>()

  /**
   * 💬 Gestion dynamique des alertes
   */
  const alertLabel = ref('')
  const alertType = ref<'danger' | 'warning' | 'success' | 'info'>('danger')

  /**
   * 🧠 Réception des changements de force
   */
  function onStrengthChange({ level, valid }: { level: string; valid: boolean }) {
    // Si champ vide => reset complet
    if (!modelValue.value || modelValue.value.toString().trim() === '') {
      alertLabel.value = ''
      alertType.value = 'danger'
      return
    }

    // Si mot de passe valide
    if (valid) {
      alertLabel.value = ''
      alertType.value = 'success'
    } else {
      // Messages adaptés selon la force
      const messages: Record<string, string> = {
        weak: 'Mot de passe trop faible',
        medium: 'Mot de passe à renforcer',
        strong: '',
      }

      alertLabel.value = messages[level] || 'Mot de passe trop faible'
      alertType.value = level === 'medium' ? 'warning' : 'danger'
    }
  }

  /**
   * 👀 Watch : si l’utilisateur efface le champ manuellement
   */
  watch(modelValue, (val) => {
    if (!val || val.toString().trim() === '') {
      alertLabel.value = ''
      alertType.value = 'danger'
    }
  })
</script>
