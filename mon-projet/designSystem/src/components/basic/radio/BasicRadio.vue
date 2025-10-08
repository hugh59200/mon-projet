<template>
  <div
    class="radio-button"
    @click="toggleChecked"
    :class="{ 'radio-button--disabled': isDisabled }"
  >
    <span
      class="radio-button__icon"
      :class="iconClasses"
    >
      <template v-if="isChecked">
        <BasicIcon
          class="radio-button__checked-icon"
          name="radio-checked"
          active
        />
      </template>
      <template v-else>
        <span class="radio-button__unchecked"></span>
      </template>
    </span>
    <BasicText
      v-if="props.label"
      class="radio-button__label"
    >
      {{ props.label }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { RadioProps } from '@designSystem/components'
  import { isNullOrUndefined } from '@/features/shared/tools/object'

  const props = withDefaults(defineProps<RadioProps>(), {
    disabled: false,
    label: '',
  })

  const modelValue = defineModel<boolean | null | undefined>()

  const isChecked = computed(() => {
    return modelValue.value === true
  })
  const isDisabled = computed(() => isNullOrUndefined(modelValue.value) || props.disabled)

  const iconClasses = computed(() => ({
    'radio-button__icon--checked': isChecked.value,
    'radio-button__icon--unchecked': !isChecked.value,
    'radio-button__icon--disabled': isDisabled.value,
  }))

  const toggleChecked = () => {
    if (!isDisabled.value) {
      modelValue.value = !modelValue.value
    }
  }
</script>

<style lang="less">
  @import './BasicRadio.less';
</style>
