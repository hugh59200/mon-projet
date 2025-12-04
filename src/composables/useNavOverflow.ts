import { ref, onMounted, onUnmounted, watch, nextTick, type Ref } from 'vue'

/**
 * Composable qui détecte si les éléments de navigation chevauchent
 * les éléments adjacents (left/right) et retourne un booléen
 * pour passer en mode compact/mobile.
 *
 * Utilise une approche de mesure "invisible" pour éviter les boucles infinies.
 */
export function useNavOverflow(
  containerRef: Ref<HTMLElement | null>,
  leftRef: Ref<HTMLElement | null>,
  centerRef: Ref<HTMLElement | null>,
  rightRef: Ref<HTMLElement | null>,
  options: { minGap?: number; debounceMs?: number } = {}
) {
  const { minGap = 16, debounceMs = 150 } = options
  const isOverflowing = ref(false)

  // On stocke la largeur naturelle du nav une fois qu'on l'a mesurée
  let cachedNavWidth: number | null = null
  let resizeObserver: ResizeObserver | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  const measureNavWidth = () => {
    if (!centerRef.value) return cachedNavWidth

    const navElement = centerRef.value.querySelector('.nav') as HTMLElement
    if (!navElement) return cachedNavWidth

    // On mesure la largeur naturelle
    const links = navElement.querySelectorAll('.nav__link')
    let totalWidth = 0

    links.forEach((link) => {
      const style = window.getComputedStyle(link)
      const width = link.getBoundingClientRect().width
      const marginLeft = parseFloat(style.marginLeft) || 0
      const marginRight = parseFloat(style.marginRight) || 0
      totalWidth += width + marginLeft + marginRight
    })

    // Ajouter les gaps entre éléments
    const navStyle = window.getComputedStyle(navElement)
    const gap = parseFloat(navStyle.gap) || 4
    totalWidth += gap * Math.max(0, links.length - 1)

    cachedNavWidth = totalWidth
    return totalWidth
  }

  const checkOverflow = () => {
    if (!containerRef.value || !leftRef.value || !rightRef.value) {
      return
    }

    const leftRect = leftRef.value.getBoundingClientRect()
    const rightRect = rightRef.value.getBoundingClientRect()

    // Calcul de l'espace disponible pour la navigation centrale
    const availableWidth = rightRect.left - leftRect.right - (minGap * 2)

    // Si le nav est visible, on mesure sa largeur
    if (centerRef.value) {
      const navWidth = measureNavWidth()
      if (navWidth !== null) {
        isOverflowing.value = navWidth > availableWidth
      }
    } else if (cachedNavWidth !== null) {
      // Si le nav est masqué mais qu'on a une mesure en cache,
      // on vérifie si on peut le réafficher
      isOverflowing.value = cachedNavWidth > availableWidth
    }
  }

  const debouncedCheck = () => {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(checkOverflow, debounceMs)
  }

  // Observer quand centerRef devient visible pour mesurer
  watch(centerRef, async (newVal) => {
    if (newVal) {
      await nextTick()
      measureNavWidth()
      checkOverflow()
    }
  })

  onMounted(() => {
    // Check initial après un court délai pour laisser le DOM se stabiliser
    setTimeout(() => {
      measureNavWidth()
      checkOverflow()
    }, 50)

    // Observer les changements de taille
    resizeObserver = new ResizeObserver(debouncedCheck)

    if (containerRef.value) {
      resizeObserver.observe(containerRef.value)
    }

    // Écouter le resize de la fenêtre
    window.addEventListener('resize', debouncedCheck)
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
    }
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    window.removeEventListener('resize', debouncedCheck)
  })

  return {
    isOverflowing,
    checkOverflow,
  }
}
