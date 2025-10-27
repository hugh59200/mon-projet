<template>
  <transition
    name="fade"
    mode="out-in"
  >
    <!-- 🌀 État LOADING -->
    <div
      v-if="loading"
      key="loading"
      class="wrapper-loader__state"
    >
      <BasicLoader
        size="medium"
        color="primary"
      />
      <p v-if="message">{{ message }}</p>
    </div>

    <!-- 🌿 État EMPTY -->
    <div
      v-else-if="isEmpty"
      key="empty"
      class="wrapper-loader__state"
    >
      <slot name="empty">
        <EmptyTablePlaceholder>
          <template #content>{{ emptyMessage }}</template>
        </EmptyTablePlaceholder>
      </slot>
    </div>

    <!-- 📦 État DATA -->
    <div
      v-else
      key="data"
      class="wrapper-loader__content"
    >
      <slot />
    </div>
  </transition>
</template>

<script setup lang="ts">
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'

  defineProps<{
    loading: boolean
    isEmpty?: boolean
    message?: string
    emptyMessage?: string
  }>()
</script>

<style scoped lang="less">
  .wrapper-loader__state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
    gap: 12px;
    padding: 60px 20px;
    color: @neutral-600;
    min-height: 200px;
  }

  .wrapper-loader__content {
    width: 100%;
    height: 100%;
  }

  /* ✨ Transition fade douce */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.25s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
