import { useAfficheCGUStore } from './useAfficheCGUStore'

export function useAfficheCGU() {
  const store = useAfficheCGUStore()
  const { showDialog, $reset } = store

  function dispose() {
    $reset()
  }

  return {
    showDialog,
    dispose,
  }
}
