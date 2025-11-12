<template>
  <section class="filter-section">
    <header
      class="filter-section__header"
      @click="toggle"
    >
      <BasicText weight="semibold">{{ title }}</BasicText>
      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="16"
        :class="{ 'icon--rotated': open }"
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
    initial: { opacity: 0, y: -8, scaleY: 0.96 },
    enter: {
      opacity: 1,
      y: 0,
      scaleY: 1,
      transition: { type: 'spring', stiffness: 180, damping: 20 },
    },
    leave: {
      opacity: 0,
      y: -6,
      scaleY: 0.96,
      transition: { duration: 0.2 },
    },
  }))

  function toggle() {
    open.value = !open.value
  }
</script>

<style scoped lang="less">
  .filter-section {
    background: #fff;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      cursor: pointer;
      color: @neutral-800;
      user-select: none;
      transition: background 0.2s ease;

      &:hover {
        background: fade(@neutral-900, 4%);
      }

      .icon--rotated {
        transform: rotate(180deg);
        transition: transform 0.25s ease;
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 12px;
      border-top: 1px solid fade(@neutral-200, 50%);
    }
  }
</style>
