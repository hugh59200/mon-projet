import type { Directive, DirectiveBinding } from 'vue'

interface LazyImgOptions {
  src: string
  placeholder?: string
  threshold?: number
  rootMargin?: string
}

type LazyImgElement = HTMLImageElement & {
  _lazyObserver?: IntersectionObserver
  _lazySrc?: string
}

/**
 * Directive v-lazy-img pour le lazy loading des images
 *
 * Usage:
 * <img v-lazy-img="imageUrl" />
 * <img v-lazy-img="{ src: imageUrl, placeholder: placeholderUrl }" />
 *
 * Avec placeholder blur:
 * <img v-lazy-img.blur="imageUrl" />
 */
export const vLazyImg: Directive<LazyImgElement, string | LazyImgOptions> = {
  mounted(el, binding) {
    const options = parseOptions(binding)
    const { src, placeholder, threshold, rootMargin } = options

    // Stocker le src pour plus tard
    el._lazySrc = src

    // Appliquer le placeholder ou un style de chargement
    if (placeholder) {
      el.src = placeholder
    } else {
      el.style.backgroundColor = '#f1f5f9'
    }

    // Styles de transition
    el.style.transition = 'opacity 0.4s ease, filter 0.4s ease'

    // Modifier si blur
    if (binding.modifiers.blur) {
      el.style.filter = 'blur(10px)'
      el.style.transform = 'scale(1.05)'
      el.style.transition = 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease'
    }

    // Créer l'observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadImage(el, binding)
            observer.unobserve(el)
          }
        })
      },
      {
        threshold: threshold ?? 0.1,
        rootMargin: rootMargin ?? '50px',
      },
    )

    el._lazyObserver = observer
    observer.observe(el)
  },

  updated(el, binding) {
    const options = parseOptions(binding)
    const newSrc = options.src

    // Si le src a changé, recharger
    if (el._lazySrc !== newSrc) {
      el._lazySrc = newSrc
      loadImage(el, binding)
    }
  },

  unmounted(el) {
    if (el._lazyObserver) {
      el._lazyObserver.disconnect()
      delete el._lazyObserver
    }
  },
}

function parseOptions(binding: DirectiveBinding<string | LazyImgOptions>): LazyImgOptions {
  if (typeof binding.value === 'string') {
    return { src: binding.value }
  }
  return binding.value
}

function loadImage(el: LazyImgElement, binding: DirectiveBinding<string | LazyImgOptions>) {
  const src = el._lazySrc
  if (!src) return

  // Créer une image temporaire pour précharger
  const img = new Image()

  img.onload = () => {
    el.src = src
    el.style.opacity = '1'

    if (binding.modifiers.blur) {
      el.style.filter = 'blur(0)'
      el.style.transform = 'scale(1)'
    }

    el.style.backgroundColor = 'transparent'
  }

  img.onerror = () => {
    console.warn(`[v-lazy-img] Failed to load image: ${src}`)
    el.style.opacity = '0.5'
  }

  // Commencer à opacité réduite pour le fade-in
  el.style.opacity = '0.6'
  img.src = src
}

export default vLazyImg
