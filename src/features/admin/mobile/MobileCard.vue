<template>
  <div
    class="mobile-card"
    :class="{ hoverable }"
  >
    <!-- HEADER -->
    <div class="mobile-card__header">
      <div class="mobile-card__title">
        <slot name="title" />
      </div>
      <div class="mobile-card__badge">
        <slot name="badge" />
      </div>
    </div>

    <!-- INFOS -->
    <div
      v-if="$slots.info"
      class="mobile-card__infos"
    >
      <slot name="info" />
    </div>

    <!-- ACTIONS -->
    <div
      v-if="$slots.actions"
      class="mobile-card__actions"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineProps<{ hoverable?: boolean }>()
</script>

<style scoped lang="less">
  .mobile-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: @neutral-50;
    border: 1px solid @neutral-200;
    border-radius: 10px;
    padding: 16px 18px;
    box-shadow: 0 1px 3px fade(@neutral-900, 5%);
    transition: all 0.2s ease-in-out;
    gap: 10px;

    &.hoverable:hover {
      box-shadow: 0 2px 6px fade(@neutral-900, 10%);
      transform: translateY(-1px);
    }

    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 8px;
    }

    &__infos {
      margin-top: 4px;
    }

    &__actions {
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
</style>
