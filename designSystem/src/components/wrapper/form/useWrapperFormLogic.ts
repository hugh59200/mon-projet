import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
import { computed, type Ref } from 'vue'

export type TabsStepperEmit = (e: 'moveNext' | 'movePrevious') => void

export function useWrapperFormLogic(modelValue: Ref<TabsModel>, tabs: Ref<TabProps[]>, emit: TabsStepperEmit) {
  const currentTab = computed(() => tabs.value.find((tab) => tab.tabKey === modelValue.value))
  const currentIndex = computed(() => tabs.value.findIndex((tab) => tab.tabKey === modelValue.value))
  const canMovePrevious = computed(() => currentIndex.value > 0)
  const canMoveNext = computed(() => currentIndex.value < tabs.value.length - 1)

  function handleMovePrevious() {
    if (canMovePrevious.value) {
      const prevTab = tabs.value[currentIndex.value - 1]
      modelValue.value = prevTab?.tabKey
      emit('movePrevious')
    }
  }

  function handleMoveNext() {
    if (canMoveNext.value) {
      const nextTab = tabs.value[currentIndex.value + 1]
      modelValue.value = nextTab?.tabKey
      emit('moveNext')
    }
  }

  return {
    currentTab,
    currentIndex,
    canMovePrevious,
    canMoveNext,
    handleMovePrevious,
    handleMoveNext,
  }
}
