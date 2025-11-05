// useScrollMessages.ts
import { nextTick } from 'vue'

export function useScrollMessages(getScrollEl: () => HTMLElement | null) {
  const scrollToEnd = async (instant = false) => {
    await nextTick()
    const el = getScrollEl()
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: instant ? 'auto' : 'smooth' })
  }

  const keepScrollOnPrepend = async (prevHeight: number) => {
    await nextTick()
    const el = getScrollEl()
    if (el) el.scrollTop = el.scrollHeight - prevHeight
  }

  return {
    getScrollEl,
    scrollToEnd,
    keepScrollOnPrepend,
  }
}
