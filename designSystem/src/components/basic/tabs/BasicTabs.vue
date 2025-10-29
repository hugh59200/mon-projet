<template>
  <div class="tabs-wrapper">
    <div
      class="tabs"
      :class="`tabs--${tabsPlacement}`"
      ref="tabsContainer"
    >
      <slot>
        <BasicTab
          v-for="tab in tabs"
          :tabKey="tab.tabKey"
          :tabState="tab.tabState"
          :key="tab.tabKey!"
        />
      </slot>
      <div
        class="tabs__indicator"
        :style="indicatorStyle"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, provide, ref, watch } from 'vue'
  import { BasicTabsKey, type BasicTabsProvided, type TabsModel } from './BasicTabs.types'

  const selectedTab = defineModel<TabsModel>()

  const props = defineProps<{
    tabs?: TabProps[]
    tabsPlacement?: 'center' | 'start'
  }>()

  const change = (value: TabsModel) => {
    selectedTab.value = value
  }

  provide<BasicTabsProvided>(BasicTabsKey, {
    selectedTab,
    change,
  })

  // 🎯 Gestion de l'indicateur glissant
  const tabsContainer = ref<HTMLElement | null>(null)
  const indicatorLeft = ref(0)
  const indicatorWidth = ref(0)

  const updateIndicator = () => {
    if (!tabsContainer.value) return
    const activeTab = tabsContainer.value.querySelector('.tab--selected') as HTMLElement | null
    if (activeTab) {
      const rect = activeTab.getBoundingClientRect()
      const containerRect = tabsContainer.value.getBoundingClientRect()
      indicatorLeft.value = rect.left - containerRect.left + tabsContainer.value.scrollLeft
      indicatorWidth.value = rect.width
    }
  }

  watch(selectedTab, async () => {
    await nextTick()
    updateIndicator()
  })

  onMounted(() => {
    nextTick(updateIndicator)
    window.addEventListener('resize', updateIndicator)
  })

  // 💅 Style dynamique
  const indicatorStyle = computed(() => ({
    transform: `translateX(${indicatorLeft.value}px)`,
    width: `${indicatorWidth.value}px`,
  }))
</script>

<style lang="less">
  .tabs-wrapper {
    position: relative;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
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

    &--start {
      justify-content: flex-start;
    }

    .tab {
      flex: none; /* ✅ évite la contraction */
      white-space: nowrap;
      min-width: 120px;
    }

    /* ✅ Barre d’indicateur animée */
    &__indicator {
      position: absolute;
      bottom: 0;
      height: 3px;
      background-color: @primary-600;
      border-radius: 3px;
      transition:
        transform 0.3s ease,
        width 0.3s ease;
    }
  }
</style>
