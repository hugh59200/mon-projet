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
    :input-type
    :alertLabel
    :alertType
  >
    <input
      :class="`textalign--${textAlign}`"
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
  import { computed, nextTick, ref, watch } from 'vue'
  import {
    type AlertInputProps,
    type InputProps,
    type InputNumberEvents,
    type InputNumberModel,
    type InputNumberProps,
    useAutoId,
  } from '@designSystem/components'
  import { isNullUndefinedOrEmptyString } from '@/features/shared/tools/object'
  import { formatNumber } from '@/features/shared/tools/number'

  const props = withDefaults(defineProps<InputNumberProps & InputProps & AlertInputProps>(), {
    decimal: 2,
    size: 'medium',
    readonly: false,
    disabled: false,
    textAlign: 'left',
  })

  const id = useAutoId('input-number')
  const modelValue = defineModel<InputNumberModel>()
  const emit = defineEmits<InputNumberEvents>()
  const estModifie = ref(false)
  const input = ref(null)

  const formatNumberOptions = computed(() => ({
    decimal: props.decimal,
    pourcentage: props.pourcentage,
    separateur: props.separateur,
  }))

  const texte = ref<string>(formatNumber(props.modelValue, formatNumberOptions.value))
  if (typeof props.defaultValue === 'number' && isNullUndefinedOrEmptyString(props.modelValue)) {
    nextTick(() => {
      if (props.modelValue !== props.defaultValue) {
        emit('update:modelValue', props.defaultValue!)
      }
    })
  }
  const textChanged = (event: Event) => {
    const chaine = (event.target as HTMLInputElement).value
    estModifie.value = true
    const cleanValue = cleanText(chaine)
    const number = tryParse(chaine)

    if (number !== undefined) {
      emit('update:modelValue', number)
    } else {
      emit('update:modelValue', cleanValue || null)
    }

    texte.value = chaine
    texte.value = cleanValue!
  }

  const floor = (num: number, precision: number) => {
    /* ENH : Problématique avec des valeurs comme 32.3, il le convertit en 32.29 (Idem avec 32.80, 32.98)*/
    /*
    const modifier = 10 ** precision
    return Math.floor(num * modifier) / modifier*/

    return +num.toFixed(precision)
  }
  const cleanText = (value: string): string | undefined => {
    return (value =
      props.decimal === 0 ? value.replace(/[^0-9]/g, '') : value.replace(/,/g, '.').replace(/[^0-9|^.]/g, ''))
  }
  const tryParse = (value: string): number | undefined => {
    value = cleanText(value)!
    if (value !== '') {
      const number = parseFloat(value)

      if (!isNaN(number)) {
        return floor(
          number / (props.pourcentage ? 100 : 1),
          (props.pourcentage && props.decimal === 0 ? 1 : props.decimal) * (props.pourcentage ? 2 : 1),
        )
      }
    }
  }

  const onFocus = (event: FocusEvent) => {
    estModifie.value = false
    if (props.separateur && typeof props.modelValue === 'number') {
      texte.value = texte.value.replace(/\./g, '')
      nextTick(() => (event.target as HTMLInputElement).select())
    }
  }

  const onBlur = (event: FocusEvent): void => {
    if (!estModifie.value) {
      if (props.separateur && typeof props.modelValue === 'number') {
        texte.value = formatNumber(props.modelValue, formatNumberOptions.value)
      }
      return
    }

    const newValue = (event.target as HTMLInputElement).value
    let nombre
    if (newValue === '' && typeof props.defaultValue === 'number') {
      nombre = props.defaultValue
      emit('update:modelValue', nombre)
    } else {
      nombre = tryParse(newValue)
    }
    if (nombre !== undefined) {
      texte.value = (event.target as HTMLInputElement).value = formatNumber(nombre, formatNumberOptions.value)
    } else {
      texte.value = newValue
    }
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (document.activeElement !== input.value) {
        texte.value = formatNumber(newValue, formatNumberOptions.value)
      }
    },
  )
</script>
<style lang="less">
  @import '../input/BasicInput.less';

  .textalign {
    &--left {
      text-align: left;
    }
    &--right {
      text-align: right;
    }
  }
</style>
