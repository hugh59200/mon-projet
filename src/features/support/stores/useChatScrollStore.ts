import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useChatScrollStore = defineStore('chatScroll', () => {
  const scrollPositions = ref<Record<string, number>>({})

  const saveScroll = (userId: string, scrollTop: number) => {
    if (!userId) return
    scrollPositions.value[userId] = scrollTop
  }

  const getScroll = (userId: string): number => scrollPositions.value[userId] ?? 0

  const STORAGE_KEY = 'chat-scroll-positions'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      scrollPositions.value = JSON.parse(stored)
    } catch {}
  }

  watch(
    scrollPositions,
    (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
    },
    { deep: true },
  )

  return { scrollPositions, saveScroll, getScroll }
})
