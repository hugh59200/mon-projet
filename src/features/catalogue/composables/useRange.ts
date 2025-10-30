import { computed, ref, watch } from 'vue'

export function useRange(minInitial = 0, maxInitial = 100) {
  const min = ref(minInitial)
  const max = ref(maxInitial)
  const from = ref(minInitial)
  const to = ref(maxInitial)

  const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)
  const format = (v: number) => v.toFixed(2).replace('.', ',')

  const trackStyle = computed(() => {
    const left = ((from.value - min.value) / (max.value - min.value)) * 100
    const right = ((to.value - min.value) / (max.value - min.value)) * 100
    return { left: `${left}%`, width: `${Math.max(0, right - left)}%` }
  })

  function setMinMax(newMin: number, newMax: number) {
    min.value = newMin
    max.value = newMax
    from.value = newMin
    to.value = newMax
  }

  watch([from, to], () => {
    from.value = clamp(from.value, min.value, to.value)
    to.value = clamp(to.value, from.value, max.value)
  })

  

  return {
    min,
    max,
    from,
    to,
    trackStyle,
    clamp,
    format,
    setMinMax,
  }
}
