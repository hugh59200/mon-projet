<template>
  <div
    :class="[
      'moduleCard',
      `moduleCard--${iconName}`,
      { 'moduleCard--active': isActive },
      { 'moduleCard--disabled': disabled },
    ]"
    @click="$emit('setActive')"
  >
    <div class="icon--container">
      <BasicIcon
        :name="iconName!"
        :active="isActive"
      />
    </div>
    <BasicText :weight="isActive ? 'semibold' : 'regular'">
      {{ title }}
    </BasicText>
  </div>
</template>

<script setup lang="ts">
  import type { IconName } from '@designSystem/fondation/icons/iconsList'

  export type IconTitleCardProps = {
    title: string
    iconName: IconName | undefined
    isActive?: boolean
    disabled?: boolean
  }

  defineProps<IconTitleCardProps>()

  defineEmits(['setActive'])
</script>

<style lang="less">
  .moduleCard {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-10);
    border-radius: var(--spacing-10);
    border: 1px solid @neutral-200;
    gap: 8px;
    cursor: pointer;
    text-align: center;
    transition:
      background-color 0.3s ease,
      border-color 0.3s ease;

    svg {
      padding-top: var(--spacing-10);
      height: 100%;
      fill: var(--secondary-100);
      transition: fill 0.3s ease;
      transform: scale(1.4);
    }

    .icon--container {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &:not(.moduleCard--active):hover {
      background: #f6fbff;
    }

    &--active {
      background-color: var(--secondary-900);
      color: white;

      &:deep(svg g) {
        fill: white !important;
      }

      svg {
        fill: white;
      }
    }

    &--disabled {
      background-color: @grey-200;
      pointer-events: none;
      opacity: 0.6;
      cursor: not-allowed;
    }

    .formation--externe {
      background-color: @pink-400;
    }
  }
</style>
