<template>
  <div
    :class="['checkbox', { 'checkbox--disabled': disabled, 'checkbox--readonly': readonly }]"
    @click.stop.prevent="toggleChecked"
  >
    <span
      :class="[
        'checkbox__icon',
        {
          'checkbox__icon--checked': isChecked,
          'checkbox__icon--unchecked': isUnchecked,
          'checkbox__icon--disabled': disabled,
        },
      ]"
      @keyup.enter="toggleChecked"
      role="checkbox"
      :aria-checked="isChecked"
      tabindex="0"
    >
      <div class="checkbox__icon--container">
        <div v-if="isUnchecked"></div>
        <BasicIcon
          v-else
          name="checked"
          active
        />
      </div>
    </span>

    <div class="checkbox__label">
      <slot>
        <BasicText>{{ label }}</BasicText>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { isNullOrUndefined } from '@/features/shared/tools/object'
  import type { CheckboxProps } from '@designSystem/components'
  import { computed } from 'vue'

  const props = withDefaults(defineProps<CheckboxProps>(), {
    disabled: false,
    readonly: false,
    label: '',
  })

  const modelValue = defineModel<boolean | null>()

  const isChecked = computed(() => modelValue.value === true)
  const isUnchecked = computed(
    () => modelValue.value === false || isNullOrUndefined(modelValue.value),
  )

  const toggleChecked = () => {
    if (!props.disabled && !props.readonly) {
      modelValue.value = !isChecked.value
    }
  }
</script>
<style lang="less">
  @import './BasicCheckbox.less';
</style>
