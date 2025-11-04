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
  import { ref, watch } from 'vue'

  const props = defineProps<{
    title: string
    modelValue?: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
  }>()

  const open = ref(props.modelValue ?? true)

  watch(
    () => props.modelValue,
    (v) => {
      if (v !== undefined) open.value = v
    },
  )

  function toggle() {
    open.value = !open.value
    emit('update:modelValue', open.value)
  }
</script>

<style scoped lang="less">
  .filter-section {
    background: #fff;
    border: 1px solid @neutral-200;
    border-radius: 12px;
    // overflow: hidden;
    transition: all 0.2s ease;

    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      cursor: pointer;
      color: @neutral-800;
      user-select: none;

      &:hover {
        background: fade(@neutral-900, 4%);
      }
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 16px; /* <== espace uniforme entre inputs et boutons */
      padding: 12px;
      border-top: 1px solid fade(@neutral-200, 50%);
    }
  }

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
