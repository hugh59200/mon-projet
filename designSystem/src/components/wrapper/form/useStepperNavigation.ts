import { computed, type Ref } from 'vue'

export type StepItem = {
  id: string | number
  label?: string
  color?: string
}

export interface StepperNavigationOptions {
  onMoveNext?: (next: StepItem | null) => void
  onMovePrevious?: (prev: StepItem | null) => void
}

export function useStepperNavigation<T extends StepItem>(
  modelValue: Ref<string | number | null | undefined>,
  steps: Ref<T[]>,
  options: StepperNavigationOptions = {},
) {
  const currentIndex = computed(() => steps.value.findIndex((s) => s.id === modelValue.value))

  const currentStep = computed(() => steps.value[currentIndex.value] ?? null)
  const canMovePrevious = computed(() => currentIndex.value > 0)
  const canMoveNext = computed(() => currentIndex.value < steps.value.length - 1)

  function movePrevious() {
    if (!canMovePrevious.value) return
    const prev = steps.value[currentIndex.value - 1]
    modelValue.value = prev?.id
    options.onMovePrevious?.(prev!)
  }

  function moveNext() {
    if (!canMoveNext.value) return
    const next = steps.value[currentIndex.value + 1]
    modelValue.value = next?.id
    options.onMoveNext?.(next!)
  }

  return {
    currentIndex,
    currentStep,
    canMovePrevious,
    canMoveNext,
    movePrevious,
    moveNext,
  }
}
