declare global {
  interface HTMLElement {
    __cleanup__?: () => void
  }
}

/**
 * ⚡ v-feedback-animate.[type]
 * Ajoute des effets interactifs : glow, pulse, bounce, shake.
 *
 * 🔸 Types :
 *   - glow → halo lumineux
 *   - pulse → battement doux
 *   - bounce → rebond
 *   - shake → secousse horizontale
 *
 * 🔸 Options :
 *   { color?: string, scale?: number, duration?: number, repeat?: boolean }
 */
export const vFeedbackAnimate = {
  mounted(el: HTMLElement, binding: any) {
    const opts = binding.value || {}
    const duration = opts.duration ?? 800
    const color = opts.color ?? 'rgba(255,255,255,0.4)'
    const scale = opts.scale ?? 1.15
    const repeat = opts.repeat ?? false

    const style =
      binding.arg ||
      (binding.modifiers.glow
        ? 'glow'
        : binding.modifiers.bounce
          ? 'bounce'
          : binding.modifiers.shake
            ? 'shake'
            : 'pulse')

    el.style.willChange = 'transform, box-shadow'

    let currentAnimation: Animation | null = null

    const play = () => {
      if (currentAnimation) {
        currentAnimation.cancel()
        currentAnimation = null
      }

      const baseOptions = {
        duration,
        iterations: repeat ? Infinity : 1,
        fill: 'forwards' as const,
      }

      switch (style) {
        case 'glow':
          currentAnimation = el.animate(
            [
              { boxShadow: `0 0 0 ${color}` },
              { boxShadow: `0 0 12px ${color}` },
              { boxShadow: `0 0 0 ${color}` },
            ],
            { ...baseOptions, easing: 'ease-in-out' },
          )
          break

        case 'bounce':
          currentAnimation = el.animate(
            [
              { transform: 'scale(1)' },
              { transform: `scale(${scale})` },
              { transform: 'scale(1)' },
            ],
            { ...baseOptions, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
          )
          break

        case 'shake':
          currentAnimation = el.animate(
            [
              { transform: 'translateX(0)' },
              { transform: 'translateX(-3px)' },
              { transform: 'translateX(3px)' },
              { transform: 'translateX(0)' },
            ],
            { ...baseOptions, duration: 400, easing: 'ease-in-out' },
          )
          break

        default: // pulse
          currentAnimation = el.animate(
            [
              { transform: 'scale(1)', boxShadow: 'none' },
              { transform: `scale(${scale})`, boxShadow: `0 0 6px ${color}` },
              { transform: 'scale(1)', boxShadow: 'none' },
            ],
            { ...baseOptions, easing: 'ease-in-out' },
          )
      }
    }

    if (!repeat) {
      el.addEventListener('mouseenter', play)
      el.addEventListener('focus', play)
      // Support tactile pour mobile
      el.addEventListener('touchstart', play, { passive: true })
    } else {
      play()
    }

    el.__cleanup__ = () => {
      if (currentAnimation) currentAnimation.cancel()
      el.removeEventListener('mouseenter', play)
      el.removeEventListener('focus', play)
      el.removeEventListener('touchstart', play)
    }
  },

  unmounted(el: HTMLElement) {
    el.__cleanup__?.()
  },
}
