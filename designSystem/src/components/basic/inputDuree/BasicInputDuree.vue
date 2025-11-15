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
  import { computed, nextTick, ref, watch } from 'vue'
  import type { BasicInputDureeProps, InputDureeEvents, InputDureeModel } from './BasicInputDuree.types'
  import type { InputProps } from '../input/BasicInput.types'
  import { isNullUndefinedOrEmptyString } from '@/features/shared/tools/object'
  import { inputDureeToString, stringToInputDuree } from './IInputDuree'
  import { useAutoId } from '@designSystem/components'

  const props = withDefaults(defineProps<BasicInputDureeProps & InputProps>(), {
    size: 'medium',
    iconName: undefined,
    deletable: false,
    placeholder: '00h00',
    separateur: 'h',
  })

  const id = useAutoId('input-telephone')
  const modelValue = defineModel<InputDureeModel>()
  const emit = defineEmits<InputDureeEvents>()
  const estModifie = ref(false)
  const input = ref(null)

  const estModifiable = computed(() => !props.readonly && !props.disabled)

  const formater = (value?: InputDureeModel) => {
    if (typeof value?.heure !== 'number') return value?.heure ?? ''
    const minutes = `00${value.minute}`.slice(-2)
    return `${value.heure}${props.separateur}${minutes}`
  }

  const texte = ref<string>(formater(props.modelValue))

  // Fixe la valeur par défaut
  if (estModifiable.value) {
    if (props.defaultValue && isNullUndefinedOrEmptyString(props.modelValue?.heure)) {
      nextTick(() => {
        if (props.modelValue !== props.defaultValue) {
          emit('update:modelValue', props.defaultValue!)
        }
      })
    }
  }

  const textChanged = (event: Event) => {
    estModifie.value = true

    const chaine = (event.target as HTMLInputElement).value
    const duree = stringToInputDuree(chaine)

    texte.value = chaine
    emit('update:modelValue', duree)
  }

  const onFocus = (_event: FocusEvent) => (estModifie.value = false)

  const onBlur = (event: FocusEvent): void => {
    if (!estModifiable.value) return
    if (!estModifie.value) return

    let strDate = (event.target as HTMLInputElement).value
    if (/^\d{1,4}$/.test(strDate)) {
      strDate = `${strDate}${props.separateur}00`
      const newDate = stringToInputDuree(strDate)
      emit('update:modelValue', newDate)
    } else if (strDate === '' && props.defaultValue) {
      strDate = inputDureeToString(props.defaultValue) ?? ''
      emit('update:modelValue', { ...props.defaultValue })
    }
    texte.value = (event.target as HTMLInputElement).value = strDate
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
