<template>
  <WrapperFormElements
    :label
    :required
    :hint
    :alertLabel
    :alertType
  >
    <PremiumButton
      :active
      :type
      :label="buttonLabel"
      :icon-right="iconName"
      :disabled
      :size="size === 'large' ? 'lg' : size === 'medium' ? 'md' : 'sm'"
      :width
    />
  </WrapperFormElements>
</template>

<script setup lang="ts">
  import type { WrapperButtonProps } from '@designSystem/components'

  defineProps<WrapperButtonProps>()
</script>
