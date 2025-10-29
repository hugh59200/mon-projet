<template>
  <div class="tabs-wrapper">
    <div
      class="tabs"
      :class="`tabs--${tabsPlacement}`"
      ref="tabsContainer"
    >
      <!-- Liste des onglets -->
      <BasicTab
        v-for="tab in tabs"
        :key="tab.routeName"
        v-model="modelValue"
        :tabKey="tab.tabKey"
        :tabState="tab.tabState"
        :routeName="tab.routeName"
        :color="tab.color"
      >
        <template #tab-text>
          {{ tab.tabKey }}
        </template>
      </BasicTab>

      <!-- ✅ Indicateur animé -->
      <div
        class="tabs__indicator"
        :style="indicatorStyle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import type { TabProps } from '../tab/BasicTab.types'
  import type { TabsModel } from './BasicTabs.types'

  /**
   * Props & modèle bidirectionnel (v-model)
   */
  defineProps<{
    tabs?: TabProps[]
    tabsPlacement?: 'center' | 'start'
  }>()

  const modelValue = defineModel<TabsModel>()

  /**
   * 🎯 Gestion de l’indicateur glissant sous l’onglet actif
   */
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

  watch(modelValue, async () => {
    await nextTick()
    updateIndicator()
  })

  onMounted(() => {
    nextTick(updateIndicator)
    window.addEventListener('resize', updateIndicator)
  })

  /**
   * 💅 Style dynamique de l’indicateur
   */
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
      flex: none;
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
