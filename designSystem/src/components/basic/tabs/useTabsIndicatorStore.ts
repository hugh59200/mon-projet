// 📁 src/features/interface/tabs/useTabsIndicatorStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTabsIndicatorStore = defineStore(
  'tabsIndicator',
  () => {
    const indicators = ref<Record<string, { left: number; width: number; color: string }>>({})

    function setIndicator(left: number, width: number, color: string, key = 'default') {
      indicators.value[key] = { left, width, color }
    }

    function getIndicator(key = 'default') {
      return indicators.value[key] || { left: 0, width: 0, color: '#0EA5E9' }
    }

    return { indicators, setIndicator, getIndicator }
  },
  {
    persist: {
      key: 'tabs-indicator',
      storage: localStorage,
    },
  },
)
