<template>
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
      :icon="tab.icon"
      class="tabs__item"
      v-responsive-animate.fade.stagger="{ delay: 60, speed: 400 }"
    >
      <template #tab-text>{{ tab.tabKey }}</template>
    </BasicTab>
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
  @import '@designSystem/fondation/breakpoints/responsive-mixins.less';

  .tabs {
    display: flex;
    position: relative;
    gap: 8px;
    justify-content: center;
    transition: all 0.25s ease;
    white-space: nowrap;

    &--start {
      justify-content: flex-start;
    }

    // ══════════════════════════════════════════════════════════════
    // 📱 MOBILE - Pas de fond supplémentaire, le parent gère
    // ══════════════════════════════════════════════════════════════
    &--mobile {
      justify-content: flex-start;
      gap: 8px;
    }
  }
</style>
