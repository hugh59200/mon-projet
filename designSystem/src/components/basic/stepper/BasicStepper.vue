<template>
  <div class="stepper">
    <PremiumButton
      :disabled="!canMovePrevious"
      label="Précédent"
      type="secondary"
      variant="ghost"
      size="sm"
      icon-left="ArrowLeft"
      @click="$emit('movePrevious')"
    />
    <PremiumButton
      :disabled="!canMoveNext"
      label="Suivant"
      type="secondary"
      variant="ghost"
      size="sm"
      icon-right="ArrowRight"
      @click="$emit('moveNext')"
    />
  </div>
</template>

<script setup lang="ts">
  defineProps<{ canMoveNext: boolean; canMovePrevious: boolean }>()
  defineEmits(['moveNext', 'movePrevious'])
</script>
<style scoped lang="less">
  .stepper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: @spacing-15;
  }

  @container (max-width: @breakpoint-mobile) {
    .stepper {
      flex: 1;
      display: flex;
      justify-content: space-between;
      flex-wrap: nowrap;
    }
  }

  @container (max-width: 380px) {
    .stepper {
      :deep(.text) {
        display: none;
      }
    }
  }
</style>
