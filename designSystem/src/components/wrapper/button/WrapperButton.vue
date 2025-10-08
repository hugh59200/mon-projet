<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
  >
    <BasicButton
      :active
      :type
      :label="buttonLabel"
      :icon-right
      :icon-name
      :disabled
      :size
      :width
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperButtonProps } from '@designSystem/components'

  defineProps<WrapperButtonProps>()
</script>
