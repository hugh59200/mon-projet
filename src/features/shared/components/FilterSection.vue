<template>
  <section class="filter-section">
    <header
      class="filter-section__header"
      @click="toggle"
    >
      <BasicText
        weight="semibold"
        size="body-m"
      >
        {{ title }}
      </BasicText>

      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="18"
        class="filter-section__chevron"
        :class="{ 'is-open': open }"
      />
    </header>

    <div
      v-motion="motion"
      v-show="open"
      class="filter-section__content"
    >
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  const open = defineModel<boolean>({ default: true })
  defineProps<{ title: string }>()

  const motion = computed(() => ({
    initial: { opacity: 0, y: -4, scaleY: 0.98 },
    enter: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 160, damping: 22 },
    },
    leave: {
      opacity: 0,
      y: -4,
      scaleY: 0.98,
      transition: { duration: 0.15 },
    },
  }))

  function toggle() {
    open.value = !open.value
  }
</script>

<style scoped lang="less">
  .filter-section {
    background: rgba(var(--neutral-0-rgb), 0.95);
    border: 1px solid rgba(var(--neutral-200-rgb), 0.55);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(var(--neutral-900-rgb), 0.04);
    transition: all 0.25s ease;

    &__header {
      padding: 14px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      background: rgba(var(--neutral-50-rgb), 0.6);
      transition: background 0.2s ease;

      &:hover {
        background: rgba(var(--neutral-100-rgb), 0.8);
      }
    }

    &__chevron {
      transition:
        transform 0.25s ease,
        opacity 0.25s ease;

      &.is-open {
        transform: rotate(180deg);
      }
    }

    &__content {
      padding: 18px 18px 22px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      border-top: 1px solid rgba(var(--neutral-200-rgb), 0.5);
    }
  }
</style>
