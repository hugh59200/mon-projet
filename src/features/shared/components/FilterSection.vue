<template>
  <section
    class="fs"
    :class="{ 'is-open': open }"
  >
    <header
      class="fs__header"
      role="button"
      :aria-expanded="open"
      :aria-controls="contentId"
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
        :name="'ChevronDown'"
        :size="18"
        class="fs__chevron"
        :class="{ 'is-open': open }"
      />
    </header>

    <div
      v-motion="motion"
      v-show="open"
      :id="contentId"
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

  // id unique (utile si tu as plusieurs FsSection dans la page)
  const contentId = `fs-content-${Math.random().toString(36).slice(2)}`

  const motion = computed(() => ({
    initial: { opacity: 0, y: -4, scale: 0.98 },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring', stiffness: 180, damping: 18 },
    },
    leave: {
      opacity: 0,
      y: -4,
      scale: 0.98,
      transition: { duration: 0.12 },
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

    &:hover {
      border-color: var(--surface-border-strong);
    }

    /* HEADER */
    &__header {
      padding: 16px 20px;
      background: var(--surface-3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      user-select: none;
      transition: background var(--transition-fast);
      width: 100%;

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

    /* Chevron improved smoothness */
    &__chevron {
      transition:
        transform 0.28s ease,
        opacity 0.2s ease;
      opacity: 0.7;

      &.is-open {
        transform: rotate(180deg);
      }

      &:hover {
        opacity: 1;
      }
    }

    /* CONTENT */
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
