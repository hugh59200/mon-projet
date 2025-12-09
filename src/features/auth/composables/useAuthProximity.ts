import { ref, type Ref } from 'vue'

/**
 * Sur mobile/tablet, force toujours le mode inline.
 * Sur desktop, toujours inline aussi (simplifié).
 */
export function useAuthProximity(
  _cardRef: Ref<HTMLElement | null>,
  _options: { minGap?: number; bottomHeight?: number; debounceMs?: number } = {}
) {
  // Toujours inline pour simplifier
  const isTooClose = ref(true)

  return {
    isTooClose,
    checkProximity: () => {},
  }
}
