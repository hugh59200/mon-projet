<template>
  <div
    ref="tabRef"
    :class="['tab', `tab--${tabClass}`]"
    @click="handleTabClick"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <BasicText
      :wrap-all="!selected && !isHovered"
      :nb-max-lines="selected || isHovered ? '2' : '1'"
      :size="selected ? 'body-xl' : 'body-l'"
      :weight="selected ? 'semibold' : 'regular'"
    >
      <slot
        name="tab-text"
        :tabKey
        :tabState
        :selected
      />
      <template v-if="!$slots['tab-text']">{{ tabKey }}</template>
    </BasicText>

    <slot
      name="tab-icon"
      :tabKey
      :tabState
      :selected
    />
    <BasicIconNext
      v-if="!$slots['tab-icon'] && tabState"
      :class="[`tab--${tabState}`]"
      :name="tabState"
      active
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, ref } from 'vue'
  import { BasicTabsKey, type BasicTabsProvided } from '../tabs/BasicTabs.types'
  import type { TabProps } from './BasicTab.types'

  const tabs = inject<BasicTabsProvided>(BasicTabsKey, null as any)
  const props = defineProps<TabProps>()

  const tabRef = ref<HTMLElement | null>(null)

  const tabClass = computed(() =>
    tabs?.selectedTab?.value === props.tabKey ? 'selected' : 'unselected',
  )

  const handleTabClick = () => {
    tabs?.change(props.tabKey)
  }

  const selected = computed(() => tabClass.value === 'selected')
  const isHovered = ref(false)
</script>

<style lang="less">
  @import './BasicTab.less';
</style>
