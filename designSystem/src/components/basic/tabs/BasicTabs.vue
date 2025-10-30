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
        <!-- 🔹 Onglets -->
        <BasicTab
          v-for="tab in tabs"
          :key="tab.routeName"
          v-model="modelValue"
          :tabKey="tab.tabKey"
          :tabState="tab.tabState"
          :routeName="tab.routeName"
          :color="tab.color"
          class="tabs__item"
          v-responsive-animate.fade.stagger="{ delay: 60, speed: 400 }"
        >
          <template #tab-text>{{ tab.tabKey }}</template>
        </BasicTab>

        <!-- ✅ Indicateur animé (desktop uniquement) -->
        <div
          v-if="!isMobile"
          class="tabs__indicator"
          :style="indicatorStyle"
          v-responsive-animate.zoom.once
        />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import type { TabProps } from '../tab/BasicTab.types'
  import type { TabsModel } from './BasicTabs.types'
  import { useTabsIndicatorStore } from './useTabsIndicatorStore'

  /* === Props === */
  const props = defineProps<{
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

  /* 💅 Couleur dynamique */
  const activeColor = computed(() => {
    const active = props.tabs?.find(
      (t) => t.routeName === modelValue.value || t.tabKey === modelValue.value,
    )
    return active?.color || '#0EA5E9'
  })

  /* 🎯 Calcul et MAJ indicateur */
  async function updateIndicator(persist = true) {
    await nextTick()
    const container = tabsContainer.value
    if (!container) return

    const activeTab = container.querySelector('.tab--selected') as HTMLElement | null
    if (!activeTab) return

    const scrollLeft = container.scrollLeft
    const left = activeTab.offsetLeft - scrollLeft
    const width = activeTab.offsetWidth

    // Évite recalcul inutile
    if (indicatorLeft.value === left && indicatorWidth.value === width) return

    indicatorLeft.value = left
    indicatorWidth.value = width

    if (persist) {
      const key = route.name?.toString() ?? 'default'
      indicatorStore.setIndicator(left, width, activeColor.value, key)
    }
  }

  /* 🧭 Suivi des changements */
  watch(modelValue, () => updateIndicator(true))

  watch(isMobile, async (newVal, oldVal) => {
    if (oldVal && !newVal) {
      const key = route.name?.toString() ?? 'default'
      const saved = indicatorStore.getIndicator(key)
      indicatorLeft.value = saved.left
      indicatorWidth.value = saved.width
      await nextTick()
      requestAnimationFrame(() => updateIndicator(false))
    }
  })

  const handleResize = () => updateIndicator(true)
  const handleScroll = () => updateIndicator(true)

  onMounted(async () => {
    await nextTick()

    const key = route.name?.toString() ?? 'default'
    const saved = indicatorStore.getIndicator(key)
    if (saved.width > 0) {
      indicatorLeft.value = saved.left
      indicatorWidth.value = saved.width
    }

    requestAnimationFrame(() => updateIndicator(true))

    window.addEventListener('resize', handleResize)
    tabsContainer.value?.addEventListener('scroll', handleScroll)
  })

  // 🧹 Nettoyage ici, pas dans onMounted()
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    tabsContainer.value?.removeEventListener('scroll', handleScroll)
  })

  /* 💫 Style indicateur dynamique */
  const indicatorStyle = computed(() => ({
    transform: `translateX(${indicatorLeft.value}px)`,
    width: `${indicatorWidth.value}px`,
    backgroundColor: activeColor.value,
  }))
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
    scrollbar-color: fade(@neutral-700, 30%) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background: fade(@neutral-700, 30%);
      border-radius: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
  }

  .tabs {
    display: inline-flex;
    position: relative;
    gap: 8px;
    padding-bottom: 6px;
    justify-content: center;
    transition: all 0.25s ease;

    &--start {
      justify-content: flex-start;
    }

    .tab {
      flex: none;
      white-space: nowrap;
      min-width: 120px;
    }

    &__indicator {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 3px;
      border-radius: 3px;
      transition:
        transform 0.45s cubic-bezier(0.25, 1, 0.5, 1),
        width 0.45s cubic-bezier(0.25, 1, 0.5, 1),
        background-color 0.3s ease;
    }

    /* ✅ Mode mobile */
    &--mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px 0;
      border-radius: 12px;
      box-shadow: 0 2px 6px fade(@neutral-800, 12%);
      margin: 0 auto 12px auto;
      overflow: hidden;
      background: @white;
      height: fit-content;
      min-height: 54px;
      transition: all 0.25s ease;

      .tab {
        display: none;
      }

      .tab--selected {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-weight: 600;
        font-size: 1.1rem;
        line-height: 1.4;
        color: @primary-700;
        text-align: center;
        padding: 10px 22px;
        border-radius: 12px;
        background: fade(@primary-50, 45%);
        box-shadow: inset 0 1px 3px fade(@primary-500, 12%);
        transition:
          transform 0.18s ease,
          box-shadow 0.18s ease,
          background 0.25s ease,
          color 0.25s ease,
          opacity 0.18s ease;

        &:active {
          transform: scale(0.95);
          opacity: 0.75;
          box-shadow: 0 0 8px fade(@primary-400, 40%);
          background: fade(@primary-100, 60%);
        }
      }

      .tab--selected .tab__icon {
        transform: scale(1.15);
        opacity: 1;
        transition:
          transform 0.25s ease,
          opacity 0.25s ease;
      }

      .tab--selected:active .tab__icon {
        transform: scale(1.05);
        opacity: 0.7;
      }

      .tabs__indicator {
        display: none;
      }
    }

    /* 🌈 Transition fade globale */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.25s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
    }
  }
</style>
