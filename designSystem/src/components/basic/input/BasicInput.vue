<template>
  <InputContainer
    v-model="modelValue"
    :size="size"
    :validation-state="validationState"
    :icon-state="iconState"
    :icon-name="iconName"
    :deletable="deletable"
    :readonly="readonly"
    :disabled="disabled"
    :input-type="inputType"
    :alert-label="alertLabel"
    :alert-type="alertType"
  >
    <input
      :id="id"
      v-model="modelValue"
      :type="inputHtmlType"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :readonly="readonly"
      :disabled="disabled"
      :autocomplete="autocomplete"
    />
  </InputContainer>
</template>

<script setup lang="ts">
  import type { AlertInputProps, InputModel, InputProps } from '@designSystem/components'
  import { useAutoId } from '@designSystem/components'
  import { computed } from 'vue'

  /* ------------------------------------------------------------
   Props
------------------------------------------------------------ */
  withDefaults(defineProps<InputProps & AlertInputProps>(), {
    size: 'medium',
    readonly: false,
    disabled: false,
    hasBg: false,
    wrap: false,
    hasLabel: true,
    maxlength: undefined,
    autocomplete: 'off',
    inputType: 'form',
  })

  /* ------------------------------------------------------------
   v-model
------------------------------------------------------------ */
  const modelValue = defineModel<InputModel>()

  /* ------------------------------------------------------------
   ID auto
------------------------------------------------------------ */
  const id = useAutoId('input')

  /* ------------------------------------------------------------
   Type HTML réel (text, number, tel…)
   => Quand tu ajouteras d’autres types, c’est prêt.
------------------------------------------------------------ */
  const inputHtmlType = computed(() => {
    return 'text'
  })
</script>
