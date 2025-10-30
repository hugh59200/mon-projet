// 📁 src/directives/vResponsiveAnimate.ts
import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
import { nextTick, watch } from 'vue'

declare global {
  interface HTMLElement {
    __responsiveStop__?: () => void
    __responsiveObserver__?: IntersectionObserver | null
  }
}

/**
 * 💫 v-responsive-animate.[style].[stagger]
 * Anime un élément (et ses enfants) lors du montage, du changement de breakpoint,
 * ou quand il entre dans le viewport.
 *
 * 🔸 Styles : fade | slide | zoom | bounce
 * 🔸 Modifiers :
 *   - stagger → anime les enfants avec délai progressif
 *   - once → ne s’anime qu’une seule fois à l’entrée du viewport
 *   - scroll → déclenche l’animation à l’apparition dans le viewport
 * 🔸 Options :
 *   { delay?: number, speed?: number, threshold?: number }
 *
 * Exemple :
 * <div v-responsive-animate.fade.scroll.stagger="{ delay: 80, speed: 600 }" />
 */
export const vResponsiveAnimate = {
  mounted(el: HTMLElement, binding: any) {
    const { isMobile } = useDeviceBreakpoint()
    const opts = binding.value || {}

    const delay = Number(opts.delay ?? 80) // délai entre enfants (ms)
    const speed = Number(opts.speed ?? 450) // durée animation (ms)
    const threshold = Number(opts.threshold ?? 0.15) // % de visibilité avant déclenchement
    const once = binding.modifiers.once ?? true

    // 🎨 Style choisi
    const style =
      binding.arg ||
      (binding.modifiers.slide
        ? 'slide'
        : binding.modifiers.zoom
          ? 'zoom'
          : binding.modifiers.bounce
            ? 'bounce'
            : 'fade')

    // 🧠 Respect du prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const enterClass = `responsive-enter-${style}`
    const leaveClass = `responsive-leave-${style}`

    const play = (type: 'in' | 'out' = 'in') => {
      el.style.setProperty('--responsive-speed', `${speed}ms`)
      el.classList.remove(enterClass, leaveClass)
      void el.offsetWidth // force reflow
      el.classList.add(type === 'in' ? enterClass : leaveClass)
    }

    const playStagger = async () => {
      await nextTick()
      const children = Array.from(el.children) as HTMLElement[]
      children.forEach((child, i) => {
        child.style.setProperty('--responsive-speed', `${speed}ms`)
        child.style.animationDelay = `${i * delay}ms`
        child.classList.remove(enterClass, leaveClass)
        void child.offsetWidth
        child.classList.add(enterClass)
      })
    }

    // 👀 Gestion du scroll
    let observer: IntersectionObserver | null = null
    const setupObserver = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (binding.modifiers.stagger) playStagger()
              else play('in')

              if (once && observer) {
                observer.disconnect()
              }
            } else if (!once) {
              // rejoue la sortie seulement si pas "once"
              play('out')
            }
          })
        },
        { threshold },
      )
      observer.observe(el)
    }

    // 🎬 Animation initiale
    const playInitial = () => {
      if (binding.modifiers.scroll) {
        setupObserver()
      } else if (binding.modifiers.stagger) {
        playStagger()
      } else {
        play('in')
      }
    }

    playInitial()

    // 🧭 Réagit aux changements mobile ↔ desktop
    const stop = watch(
      isMobile,
      async (_newVal, oldVal) => {
        if (oldVal === undefined) return
        if (binding.modifiers.scroll) return // l’observer gère ça

        // Joue la sortie puis rejoue l'entrée
        binding.modifiers.stagger ? playStagger() : play('out')

        await nextTick()
        setTimeout(() => {
          binding.modifiers.stagger ? playStagger() : play('in')
        }, speed * 0.6)
      },
      { immediate: false },
    )

    // 🧹 Nettoyage (⚡ plus de onScopeDispose warning)
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
