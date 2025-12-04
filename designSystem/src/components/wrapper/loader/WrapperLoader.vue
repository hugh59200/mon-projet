<template>
  <transition
    name="fade"
    mode="out-in"
    :duration="1"
  >
    <template v-if="loading && !hasLoaded">
      <div
        key="first-loading"
        class="wrapper-loader__state"
      >
        <BasicLoader
          size="medium"
          color="primary"
        />
        <p v-if="message">{{ message }}</p>
      </div>
    </template>
    <template v-else-if="hasLoaded && isEmpty">
      <div
        key="empty"
        class="wrapper-loader__state"
      >
        <slot name="empty">
          <EmptyTablePlaceholder>
            <template #content>{{ emptyMessage }}</template>
          </EmptyTablePlaceholder>
        </slot>
      </div>
    </template>
    <template v-else>
      <div
        key="data"
        class="wrapper-loader__content"
      >
        <div
          v-if="loading && hasLoaded"
          class="loader-overlay"
        >
          <BasicLoader
            size="small"
            color="primary"
          />
        </div>
        <slot />
      </div>
    </template>
  </transition>
</template>

<script setup lang="ts">
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'

  defineProps<{
    loading: boolean
    hasLoaded?: boolean
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
    position: relative;
    width: 100%;
    height: 100%;
  }

  .loader-overlay {
    position: absolute;
    inset: 0;
    // background: color-mix(in srgb, @neutral-50 70%, transparent);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
    border-radius: inherit;
  }

  /* ✨ Transition fade douce */
  .fade-enter-from,
  .fade-leave-to {
    // opacity: 0;
  }
</style>
