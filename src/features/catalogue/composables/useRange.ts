import { computed, reactive, watch } from 'vue'

export function useRange(minInitial = 0, maxInitial = 100, step = 0.1) {
  const range = reactive({
    min: minInitial,
    max: maxInitial,
    from: minInitial,
    to: maxInitial,
    step,
  })

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

  watch(
    () => [range.from, range.to, range.min, range.max],
    () => {
      range.from = clamp(range.from, range.min, range.to)
      range.to = clamp(range.to, range.from, range.max)
    },
    { immediate: true },
  )

  const trackStyle = computed(() => {
    const left = ((range.from - range.min) / (range.max - range.min)) * 100
    const right = ((range.to - range.min) / (range.max - range.min)) * 100
    return { left: `${left}%`, width: `${Math.max(0, right - left)}%` }
  })

  function setMinMax(newMin: number, newMax: number) {
    range.min = newMin
    range.max = newMax
    range.from = newMin
    range.to = newMax
  }

  return { range, trackStyle, setMinMax }
}
