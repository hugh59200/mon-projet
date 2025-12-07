<template>
  <div class="stat">
    <span class="stat__value">{{ value }}</span>
    <span class="stat__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: string | number
  label: string
}>()
</script>

<style scoped lang="less">
.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  &__value {
    font-family: 'Instrument Sans', sans-serif;
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-400), var(--primary-600));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__label {
    font-size: 12px;
    font-weight: 500;
    color: @neutral-500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}
</style>
