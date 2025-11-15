<template>
  <section class="fs">
    <header
      class="fs__header"
      @click="toggle"
    >
      <BasicText
        size="body-m"
        weight="semibold"
        class="fs__title"
      >
        {{ title }}
      </BasicText>

      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="18"
        class="fs__chevron"
        :class="{ 'is-open': open }"
      />
    </header>

    <div
      v-motion="motion"
      v-show="open"
      class="fs__content"
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
    initial: { opacity: 0, y: -6, scaleY: 0.96 },
    enter: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 160, damping: 20 },
    },
    leave: {
      opacity: 0,
      y: -6,
      scaleY: 0.96,
      transition: { duration: 0.14 },
    },
  }))

  function toggle() {
    open.value = !open.value
  }
</script>

<style scoped lang="less">
  .fs {
    background: var(--surface-2);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-l);
    box-shadow: var(--surface-elevated-shadow);
    transition: var(--transition-medium);
    overflow: hidden;

    /* hover léger sur tout le bloc */
    &:hover {
      border-color: var(--surface-border-strong);
    }

    /* ===== HEADER ===== */
    &__header {
      padding: 16px 20px;
      background: var(--surface-3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      transition: var(--transition-fast);

      &:hover {
        background: var(--surface-hover);
      }

      &:active {
        background: var(--surface-active);
      }
    }

    &__title {
      color: var(--text-title-contrast);
    }

    /* Chevron animation */
    &__chevron {
      transition:
        transform 0.3s ease,
        opacity 0.2s ease;
      opacity: 0.75;

      &.is-open {
        transform: rotate(180deg);
      }

      &:hover {
        opacity: 1;
      }
    }

    /* ===== CONTENT ===== */
    &__content {
      padding: 20px 22px 26px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      background: var(--surface-1);
      border-top: 1px solid var(--surface-border);
    }
  }
</style>
