<template>
  <InputContainer
    v-model="modelValue"
    :size
    :validation-state
    :icon-state
    :icon-name
    :deletable
    :readonly
    :disabled
  >
    <input
      type="text"
      ref="input"
      :id
      :value="texte"
      :placeholder
      :readonly
      :disabled
      :maxlength
      @input="textChanged"
      @blur="onBlur"
      @focus="onFocus"
    />
  </InputContainer>
</template>

<script setup lang="ts">
  import { ref, computed, watch, nextTick } from 'vue'
  import { isNullUndefinedOrEmptyString } from '@/features/shared/tools/object'
  import {
    type InputProps,
    type InputTelephoneProps,
    type InputTelephoneEvents,
    type InputTelephoneModel,
    useAutoId,
  } from '@designSystem/components'

  const props = withDefaults(defineProps<InputTelephoneProps & InputProps>(), {
    size: 'medium',
    iconName: undefined,
    readonly: false,
    deletable: false,
    placeholder: 'jj/mm/aaaa',
  })

  const id = useAutoId('input-telephone')
  const emit = defineEmits<InputTelephoneEvents>()
  const modelValue = defineModel<InputTelephoneModel>()
  const input = ref(null)
  const estModifie = ref(false)
  const estModifiable = computed(() => !props.readonly && !props.disabled)

  const formater = (value?: InputTelephoneModel) => {
    if (isNullUndefinedOrEmptyString(value)) return value!

    const result = value!.replace(/\D+/g, '').match(/^(\d{2})(\d{0,2})(\d{0,2})(\d{0,2})(\d{0,2})$/)
    if (result?.length === 6) {
      return [result[1], result[2], result[3], result[4], result[5]].filter((part) => part !== '').join(' ')
    } else {
      return value!
    }
  }

  const texte = ref<string>(formater(props.modelValue))

  // Définir la valeur par défaut si fournie
  if (estModifiable.value && props.defaultValue && isNullUndefinedOrEmptyString(modelValue)) {
    nextTick(() => {
      if (modelValue.value !== props.defaultValue) {
        emit('update:modelValue', props.defaultValue!)
      }
    })
  }

  const tryParse = (value: string): string => {
    return isNullUndefinedOrEmptyString(value) ? '' : value.replace(/\D/g, '')
  }

  const textChanged = (event: Event) => {
    estModifie.value = true

    const chaine = (event.target as HTMLInputElement).value
    const cleanText = tryParse(chaine)
    const formatText = formater(cleanText)

    texte.value = (event.target as HTMLInputElement).value = formatText
    emit('update:modelValue', cleanText)
  }

  const onFocus = () => {
    estModifie.value = false
  }

  const onBlur = (event: FocusEvent): void => {
    if (!estModifiable.value || !estModifie.value) return

    const newValue = ((event.target as HTMLInputElement).value ?? '').trim()

    let strTelephone: string | undefined | null
    if (newValue === '' && props.defaultValue) {
      strTelephone = props.defaultValue
      emit('update:modelValue', strTelephone || null)
    } else {
      strTelephone = tryParse(newValue)
    }

    texte.value = (event.target as HTMLInputElement).value = formater(strTelephone)
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (document.activeElement !== input.value) {
        texte.value = formater(newValue)
      }
    },
  )
</script>
