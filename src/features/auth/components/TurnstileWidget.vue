<template>
  <div class="turnstile-wrapper">
    <div
      :id="containerId"
      class="cf-turnstile"
    ></div>
    <p
      v-if="error"
      class="error-text"
    >
      Veuillez valider la sécurité.
    </p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, ref } from 'vue'

  // Props & Emits
  const emit = defineEmits<{
    (e: 'verify', token: string): void
    (e: 'expire'): void
    (e: 'error'): void
  }>()

  // ID unique pour éviter "already rendered in this container" lors du HMR
  const containerId = `turnstile-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  const widgetId = ref<string | null>(null)
  const error = ref(false)
  const isMounted = ref(true)

  // Récupération de la clé publique depuis le .env
  const SITE_KEY = import.meta.env.VITE_CLOUDFLARE_SITE_KEY as string | undefined

  // Détection automatique du mode dev/test pour désactiver le CAPTCHA
  const isCaptchaDisabled = () => {
    return (
      import.meta.env.VITE_DISABLE_CAPTCHA === 'true' ||
      import.meta.env.DEV || // Auto-désactivé en dev
      typeof (window as any).Cypress !== 'undefined'
    )
  }

  // Déclaration globale pour TypeScript
  declare global {
    interface Window {
      turnstile?: {
        render: (
          element: HTMLElement | string,
          options: {
            sitekey: string
            callback: (token: string) => void
            'error-callback': () => void
            'expired-callback': () => void
            theme?: 'light' | 'dark' | 'auto'
            size?: 'normal' | 'compact' | 'flexible'
            appearance?: 'always' | 'execute' | 'interaction-only'
            language?: string
          },
        ) => string
        remove: (widgetId: string) => void
        reset: (widgetId: string) => void
        isExpired: (widgetId: string) => boolean
      }
    }
  }

  const renderWidget = () => {
    if (!isMounted.value) return

    const container = document.getElementById(containerId)
    if (!window.turnstile || !container) return

    // Nettoyage préventif
    if (widgetId.value) {
      try {
        window.turnstile.remove(widgetId.value)
      } catch {
        // Ignore
      }
      widgetId.value = null
    }

    // Vérifier que le sitekey est valide
    if (!SITE_KEY || typeof SITE_KEY !== 'string') {
      console.error('[Turnstile] VITE_CLOUDFLARE_SITE_KEY manquant ou invalide')
      return
    }

    try {
      widgetId.value = window.turnstile.render(container, {
        sitekey: SITE_KEY,
        theme: 'light',
        size: 'flexible',
        appearance: 'interaction-only',
        language: 'fr',
        callback: (token: string) => {
          error.value = false
          emit('verify', token)
        },
        'error-callback': () => {
          error.value = true
          emit('error')
        },
        'expired-callback': () => {
          emit('expire')
        },
      })
    } catch (e) {
      console.error('[Turnstile] Erreur rendu:', e)
    }
  }

  const loadScript = (): Promise<void> => {
    return new Promise((resolve) => {
      // Script déjà chargé
      if (window.turnstile) {
        resolve()
        return
      }

      // Script en cours de chargement
      const existing = document.querySelector(
        'script[src*="challenges.cloudflare.com/turnstile"]'
      ) as HTMLScriptElement | null

      if (existing) {
        existing.addEventListener('load', () => resolve())
        // Si déjà chargé
        if (window.turnstile) resolve()
        return
      }

      // Charger le script (sans callback global pour éviter les conflits)
      const script = document.createElement('script')
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.onload = () => resolve()
      document.head.appendChild(script)
    })
  }

  onMounted(async () => {
    // Mode dev/test : Auto-validation du CAPTCHA
    if (isCaptchaDisabled()) {
      console.info('ℹ️ CAPTCHA désactivé (mode dev/test)')
      setTimeout(() => {
        if (isMounted.value) {
          emit('verify', 'dev-captcha-bypass-token')
        }
      }, 100)
      return
    }

    // Charger le script et rendre le widget
    await loadScript()

    // Attendre que le DOM soit prêt
    requestAnimationFrame(() => {
      if (isMounted.value) {
        renderWidget()
      }
    })
  })

  onUnmounted(() => {
    isMounted.value = false
    if (window.turnstile && widgetId.value) {
      try {
        window.turnstile.remove(widgetId.value)
      } catch {
        // Ignore
      }
    }
  })

  // Exposer une méthode reset pour le parent
  defineExpose({
    reset: () => {
      if (window.turnstile && widgetId.value) {
        window.turnstile.reset(widgetId.value)
      }
    },
  })
</script>

<style scoped lang="less">
  .turnstile-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px 0;
  }

  .cf-turnstile {
    max-width: 280px;
    transform: scale(0.85);
    transform-origin: center;
    margin: -4px 0;

    :deep(iframe) {
      border-radius: 10px !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }

  .error-text {
    color: @danger-500;
    font-size: 0.75rem;
    margin: 0;
    text-align: center;
  }
</style>
