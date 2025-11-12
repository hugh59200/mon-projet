<template>
  <div
    class="smart-skeleton"
    v-motion="containerMotion"
  >
    <div
      v-if="showHeader"
      class="smart-skeleton__header"
      v-motion="fadeIn"
    >
      <BasicSkeleton
        width="45%"
        height="22px"
        border-radius="6px"
      />
    </div>
    <div class="smart-skeleton__content">
      <template
        v-for="(_block, _i) in blocks"
        :key="_i"
      >
        <div
          class="smart-skeleton__block"
          v-motion="fadeIn"
        >
          <BasicSkeleton
            width="70%"
            height="14px"
          />
          <BasicSkeleton
            width="90%"
            height="14px"
          />
          <BasicSkeleton
            width="60%"
            height="14px"
          />
        </div>
      </template>
    </div>
    <div
      v-if="showActions"
      class="smart-skeleton__actions"
      v-motion="fadeInPop"
    >
      <BasicSkeleton
        width="120px"
        height="34px"
        border-radius="8px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BasicSkeleton from './BasicSkeleton.vue'

  defineProps<{
    showHeader?: boolean
    showActions?: boolean
    blocks?: number
  }>()

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }
  const fadeInPop = {
    initial: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 140 } },
  }
  const containerMotion = {
    initial: { opacity: 0, scale: 0.96 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  }
</script>

<style scoped lang="less">
  .smart-skeleton {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 10px 0;
    min-height: 180px;
  }

  .smart-skeleton__header {
    margin-bottom: 6px;
  }

  .smart-skeleton__content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .smart-skeleton__block {
    display: flex;
    flex-direction: column;
    gap: 6px;
    background: fade(@neutral-100, 60%);
    padding: 14px;
    border-radius: 8px;
  }

  .smart-skeleton__actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 8px;
  }
</style>
