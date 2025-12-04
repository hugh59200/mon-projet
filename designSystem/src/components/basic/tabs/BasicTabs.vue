<template>
  <div
    class="tabs-wrapper"
    v-responsive-animate.fade.once
  >
    <Transition name="fade">
      <div
        class="tabs"
        :class="[`tabs--${tabsPlacement}`, { 'tabs--mobile': isMobile }]"
        ref="tabsContainer"
        v-responsive-animate.slide.once
      >
        <BasicTab
          v-for="tab in tabs"
          :key="tab.routeName"
          v-model="modelValue"
          :tabKey="tab.tabKey"
          :routeName="tab.routeName"
          :color="tab.color"
          class="tabs__item"
          v-responsive-animate.fade.stagger="{ delay: 60, speed: 400 }"
        >
          <template #tab-text>{{ tab.tabKey }}</template>
        </BasicTab>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { nextTick, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import type { TabProps } from '../tab/BasicTab.types'
  import type { TabsModel } from './BasicTabs.types'
  import { useTabsIndicatorStore } from './useTabsIndicatorStore'

  defineProps<{
    tabs?: TabProps[]
    tabsPlacement?: 'center' | 'start'
  }>()

  /* === Setup === */
  const modelValue = defineModel<TabsModel>()
  const { isMobile } = useDeviceBreakpoint()
  const route = useRoute()
  const tabsContainer = ref<HTMLElement | null>(null)
  const indicatorLeft = ref(0)
  const indicatorWidth = ref(0)
  const indicatorStore = useTabsIndicatorStore()

  onMounted(async () => {
    await nextTick()

    const key = route.name?.toString() ?? 'default'
    const saved = indicatorStore.getIndicator(key)
    if (saved.width > 0) {
      indicatorLeft.value = saved.left
      indicatorWidth.value = saved.width
    }
  })
</script>

<style lang="less">
  .tabs-wrapper {
    position: relative;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    white-space: nowrap;
    scrollbar-width: thin;
    scrollbar-color: color-mix(in srgb, @neutral-700 30%, transparent) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: color-mix(in srgb, @neutral-700 30%, transparent);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .tabs {
    display: flex;
    position: relative;
    gap: 8px;
    padding-bottom: 6px;
    justify-content: center;
    transition: all 0.25s ease;

    &--start {
      justify-content: flex-start;
    }

    &--mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 6px color-mix(in srgb, @neutral-800 12%, transparent);
      margin: 0 auto;

      .tab {
        display: none;

        &--selected {
          display: flex;
        }
      }

      .tab--selected:active .tab__icon {
        transform: scale(1.05);
        opacity: 0.7;
      }
    }
  }
</style>
