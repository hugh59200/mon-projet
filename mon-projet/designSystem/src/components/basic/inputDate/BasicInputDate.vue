<template>
  <InputContainer
    v-model="modelValue"
    :size
    :validation-state
    :icon-state
    :icon-name
    :readonly
    :disabled
    :deletable="false"
  >
    <input
      type="text"
      ref="inputHtml"
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
    <BasicIcon
      v-if="hasCalendar && !disabled && !readonly"
      @mousedown.stop="toggleCalendar()"
      name="calendar"
    />
    <VueDatePicker
      v-if="hasCalendar && !disabled && !readonly"
      v-model="calendarModel"
      :inline="false"
      :textInput="false"
      :clearable="false"
      hide-input-icon
      auto-apply
      locale="fr"
      auto-position
      class="calendarDesktop"
    />
  </InputContainer>
  <Teleport to="body">
    <ModalComponent
      class="calendarMobile"
      v-model="showCalendar"
    >
      <template #header>Choisissez une date</template>
      <template #content>
        <VueDatePicker
          v-model="calendarModel"
          inline
          auto-apply
          locale="fr"
        />
      </template>
    </ModalComponent>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, watch } from 'vue'
  import VueDatePicker from '@vuepic/vue-datepicker'
  import '@vuepic/vue-datepicker/dist/main.css'
  import ModalComponent from '@/features/interface/modal/ModalComponent.vue'
  import {
    useAutoId,
    type InputDateEvents,
    type InputDateModel,
    type InputDateProps,
    type InputProps,
  } from '@designSystem/components'
  import { dateTimeToReadableDate, isDate, readableDatetoDateTime } from '@/features/shared/tools/date'
  import { isNullUndefinedOrEmptyString } from '@/features/shared/tools/object'

  const props = withDefaults(defineProps<InputDateProps & InputProps>(), {
    size: 'medium',
    iconName: undefined,
    readonly: false,
    deletable: false,
    hasCalendar: true,
    placeholder: 'jj/mm/aaaa',
  })

  const id = useAutoId('input-date')
  const emit = defineEmits<InputDateEvents>()
  const inputHtml = ref<HTMLInputElement | null>(null)
  const modelValue = defineModel<InputDateModel>()
  const estModifie = ref(false)
  const estModifiable = computed(() => !props.readonly && !props.disabled)
  const showCalendar = ref(false)

  const formater = (value?: InputDateModel) => {
    if (!isDate(value)) {
      return value ?? ''
    }

    const tokens = value.split('-')
    return `${tokens[2]}/${tokens[1]}/${tokens[0]}`
  }

  const texte = ref<string>(formater(props.modelValue))

  const calendarModel = computed({
    get: () => readableDatetoDateTime(props.modelValue),
    set: (value) => {
      const readable = dateTimeToReadableDate(value as any)
      texte.value = readable
      emit('update:modelValue', tryParse(readable) || null)
      showCalendar.value = false
    },
  })

  // Définir la valeur par défaut si fournie
  if (estModifiable.value && props.defaultValue && isNullUndefinedOrEmptyString(modelValue)) {
    nextTick(() => {
      if (modelValue.value !== props.defaultValue) {
        emit('update:modelValue', props.defaultValue!)
      }
    })
  }

  const retireCaracteresNonAutorises = (value: string): string => value.replace(/[^\d/^-]+/g, '')

  const tryParse = (value: string): string | null => {
    let text = value.replace(/\//g, '-')
    if (text !== '') {
      const tokens = text.split('-')
      if (tokens[0]?.length === 1) tokens[0] = `0${tokens[0]}`
      if (tokens[1]?.length === 1) tokens[1] = `0${tokens[1]}`
      text = `${tokens[2]}-${tokens[1]}-${tokens[0]}`
      if (isDate(text)) return text
    }
    return null
  }

  const textChanged = (event: Event) => {
    estModifie.value = true

    const inputChaine = (event.target as HTMLInputElement).value
    const cleanChaine = retireCaracteresNonAutorises(inputChaine)

    texte.value = (event.target as HTMLInputElement).value = cleanChaine

    const modelChaine = tryParse(cleanChaine)
    emit('update:modelValue', modelChaine || null)
  }

  const onFocus = () => {
    estModifie.value = false
  }

  const onBlur = (event: FocusEvent): void => {
    if (!estModifiable.value) return

    const newValue = ((event.target as HTMLInputElement).value ?? '').trim()
    let strDate: string | undefined | null
    if (newValue === '' && isDate(props.defaultValue)) {
      strDate = props.defaultValue
      emit('update:modelValue', strDate || null)
    } else {
      if (!estModifie.value) return

      strDate = tryParse(newValue)
    }

    texte.value = (event.target as HTMLInputElement).value = formater(strDate)
  }

  watch(
    () => props.modelValue,
    (newValue) => {
      if (document.activeElement !== inputHtml.value) {
        texte.value = formater(newValue)
      }
    },
  )

  const toggleCalendar = () => {
    showCalendar.value = !showCalendar.value
  }
</script>

<style lang="less">
  @import '../input/BasicInput.less';
  @import './BasicInputDate.less';
</style>
