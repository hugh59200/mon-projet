<template>
  <section class="filter-section">
    <header
      class="filter-section__header"
      @click="open = !open"
    >
      <BasicText weight="semibold">{{ title }}</BasicText>
      <BasicIconNext
        :name="open ? 'ChevronUp' : 'ChevronDown'"
        :size="16"
      />
    </header>

    <transition name="fade">
      <div
        v-show="open"
        class="filter-section__content"
      >
        <slot />
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  defineProps<{ title: string }>()
  const open = ref(true)
</script>

<style scoped lang="less">
  .filter-section {
    background: #fff;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    overflow: hidden;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      cursor: pointer;
      color: @neutral-800;
      user-select: none;
      transition: background 0.15s ease;

      &:hover {
        background: fade(@neutral-900, 4%);
      }
    }

    &__content {
      padding: 12px;
      border-top: 1px solid fade(@neutral-200, 50%);
    }
  }

  /* Animation douce */
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
    max-height: 0;
    padding: 0;
    margin: 0;
  }
</style>
