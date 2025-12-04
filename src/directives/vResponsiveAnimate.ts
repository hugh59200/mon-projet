import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import { nextTick, watch } from 'vue'

declare global {
  interface HTMLElement {
    __responsiveStop__?: () => void
    __responsiveObserver__?: IntersectionObserver | null
  }
}

/**
 * 💫 v-responsive-animate.[style].[modifiers]
 * Anime un élément à l’entrée (montage, scroll ou changement de breakpoint)
 *
 * 🔸 Styles :
 *    fade | slide | zoom | bounce | pulse | glow
 *
 * 🔸 Modifiers :
 *   - stagger → anime les enfants en cascade
 *   - once → ne s’anime qu’une seule fois
 *   - scroll → déclenche quand visible à l’écran
 *
 * 🔸 Options :
 *   { delay?: number, speed?: number, threshold?: number, color?: string, scale?: number }
 */
export const vResponsiveAnimate = {
  mounted(el: HTMLElement, binding: any) {
    const { isMobile } = useDeviceBreakpoint()
    const opts = binding.value || {}

    const delay = Number(opts.delay ?? 80)
    const speed = Number(opts.speed ?? 450)
    const threshold = Number(opts.threshold ?? 0.15)
    const once = binding.modifiers.once ?? true
    const color = opts.color ?? 'rgba(255,255,255,0.3)'
    const scale = opts.scale ?? 1.1

    // 🧠 Respect du "prefers-reduced-motion"
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // 🎨 Style choisi
    const style =
      binding.arg ||
      (binding.modifiers.slide
        ? 'slide'
        : binding.modifiers.zoom
          ? 'zoom'
          : binding.modifiers.bounce
            ? 'bounce'
            : binding.modifiers.pulse
              ? 'pulse'
              : binding.modifiers.glow
                ? 'glow'
                : 'fade')

    // ⚙️ Fonctions d’animation basées sur le style
    const animateStyle = (element: HTMLElement, _type: 'in' | 'out' = 'in') => {
      element.style.setProperty('--responsive-speed', `${speed}ms`)

      switch (style) {
        case 'pulse':
          element.animate(
            [
              { transform: 'scale(1)', boxShadow: 'none', opacity: 0 },
              { transform: `scale(${scale})`, boxShadow: `0 0 10px ${color}`, opacity: 1 },
              { transform: 'scale(1)', boxShadow: 'none', opacity: 1 },
            ],
            {
              duration: speed,
              easing: 'ease-out',
              fill: 'forwards',
            },
          )
          break

        case 'glow':
          element.animate(
            [
              { boxShadow: `0 0 0 ${color}`, opacity: 0 },
              { boxShadow: `0 0 16px ${color}`, opacity: 1 },
              { boxShadow: `0 0 0 ${color}`, opacity: 1 },
            ],
            { duration: speed * 1.2, easing: 'ease-in-out', fill: 'forwards' },
          )
          break

        case 'bounce':
          element.animate(
            [
              { transform: 'scale(0.9)', opacity: 0 },
              { transform: `scale(${scale * 1.05})`, opacity: 1 },
              { transform: 'scale(1)', opacity: 1 },
            ],
            { duration: speed, easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'forwards' },
          )
          break

        case 'slide':
          element.animate(
            [
              { transform: 'translateY(20px)', opacity: 0 },
              { transform: 'translateY(0)', opacity: 1 },
            ],
            { duration: speed, easing: 'ease-out', fill: 'forwards' },
          )
          break

        case 'zoom':
          element.animate(
            [
              { transform: 'scale(0.95)', opacity: 0 },
              { transform: 'scale(1)', opacity: 1 },
            ],
            { duration: speed, easing: 'ease-out', fill: 'forwards' },
          )
          break

        default: // fade
          element.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: speed,
            easing: 'ease-in-out',
            fill: 'forwards',
          })
      }
    }

    // 🧩 Animation en cascade
    const playStagger = async () => {
      await nextTick()
      const children = Array.from(el.children) as HTMLElement[]
      children.forEach((child, i) => {
        setTimeout(() => animateStyle(child, 'in'), i * delay)
      })
    }

    // 👀 Gestion du scroll
    let observer: IntersectionObserver | null = null
    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              binding.modifiers.stagger ? playStagger() : animateStyle(el, 'in')
              if (once && observer) observer.disconnect()
            } else if (!once) {
              animateStyle(el, 'out')
            }
          })
        },
        { threshold },
      )
      observer.observe(el)
    }

    // 🎬 Démarrage
    const playInitial = () => {
      if (binding.modifiers.scroll) setupObserver()
      else if (binding.modifiers.stagger) playStagger()
      else animateStyle(el, 'in')
    }

    playInitial()

    // 📱 Re-anime sur changement de breakpoint
    const stop = watch(
      isMobile,
      async (_new, old) => {
        if (old === undefined) return
        if (binding.modifiers.scroll) return
        animateStyle(el, 'out')
        await nextTick()
        setTimeout(() => {
          binding.modifiers.stagger ? playStagger() : animateStyle(el, 'in')
        }, speed * 0.6)
      },
      { immediate: false },
    )

    // 🧹 Nettoyage
    el.__responsiveStop__ = stop
    el.__responsiveObserver__ = observer
  },

  unmounted(el: any) {
    const stop = el.__responsiveStop__
    const observer = el.__responsiveObserver__
    if (typeof stop === 'function') stop()
    if (observer) observer.disconnect()
    delete el.__responsiveStop__
    delete el.__responsiveObserver__
  },
}
