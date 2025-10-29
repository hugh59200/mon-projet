import type { TabsModel } from '@designSystem/components/basic/tabs/BasicTabs.types'
import { computed, type Ref } from 'vue'
import { useStepperNavigation, type StepItem } from './useStepperNavigation'

export type TabsStepperEmit = (e: 'moveNext' | 'movePrevious') => void

export function useWrapperFormLogic(
  modelValue: Ref<TabsModel>,
  tabs: Ref<TabProps[]>,
  emit: TabsStepperEmit,
) {
  // ✅ Adaptation des tabs au format StepItem[]
  const mappedTabs = computed<StepItem[]>(() =>
    tabs.value.map((t) => ({
      id: (t.routeName as string) ?? (t.tabKey as string), // toujours une string
      label: String(t.tabKey ?? ''), // on force en string
      color: t.color ?? '#0EA5E9',
    })),
  )

  const {
    currentStep: currentTab,
    currentIndex,
    canMovePrevious,
    canMoveNext,
    movePrevious,
    moveNext,
  } = useStepperNavigation(modelValue as Ref<string | number | null | undefined>, mappedTabs, {
    onMovePrevious: () => emit('movePrevious'),
    onMoveNext: () => emit('moveNext'),
  })

  return {
    currentTab,
    currentIndex,
    canMovePrevious,
    canMoveNext,
    handleMovePrevious: movePrevious,
    handleMoveNext: moveNext,
  }
}
