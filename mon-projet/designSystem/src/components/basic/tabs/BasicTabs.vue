<template>
  <div
    class="tabs"
    :class="`tabs--${tabsPlacement}`"
  >
    <slot>
      <BasicTab
        v-for="tab in tabs"
        :tabKey="tab.tabKey"
        :tabState="tab.tabState"
        :key="tab.tabKey!"
      />
    </slot>
  </div>
</template>

<script setup lang="ts">
  import { provide } from 'vue'
  import { BasicTabsKey, type BasicTabsProvided, type TabsModel } from './BasicTabs.types'

  const selectedTab = defineModel<TabsModel>()

  defineProps<{
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
</script>

<style lang="less">
  .tabs {
    background-color: @neutral-0;
    display: flex;
    gap: 8px;

    &--start {
      .tab {
        flex: none;
        min-width: 250px;
      }
    }
  }
</style>
