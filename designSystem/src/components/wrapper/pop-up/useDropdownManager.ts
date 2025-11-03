import { ref, watch } from 'vue'

const activeDropdownId = ref<string | null>(null)

export function useDropdownManager(id: string) {
  function open() {
    activeDropdownId.value = id
  }

  function close() {
    if (activeDropdownId.value === id) activeDropdownId.value = null
  }

  function isActive() {
    return activeDropdownId.value === id
  }

  function onChange(fn: (active: boolean) => void) {
    return watch(activeDropdownId, (newId) => fn(newId === id))
  }

  return { open, close, isActive, onChange, activeDropdownId }
}
