<template>
  <div class="turnstile-wrapper">
    <div class="turnstile-badge">
      <BasicIconNext
        name="ShieldCheck"
        :size="14"
        class="turnstile-icon"
      />
      <span class="turnstile-label">Protection anti-bot</span>
    </div>
    <div
      ref="widgetContainer"
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
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted, onUnmounted, ref } from 'vue'

  // Props & Emits
  const emit = defineEmits<{
    (e: 'verify', token: string): void
    (e: 'expire'): void
    (e: 'error'): void
  }>()

  const widgetContainer = ref<HTMLElement | null>(null)
  const widgetId = ref<string | null>(null)
  const error = ref(false)

  // Récupération de la clé publique depuis le .env
  const SITE_KEY = import.meta.env.VITE_CLOUDFLARE_SITE_KEY

  // Détection automatique du mode dev/test pour désactiver le CAPTCHA
  // Contrôlé via VITE_DISABLE_CAPTCHA=true dans .env.local
  const isCaptchaDisabled = () => {
    return (
      import.meta.env.VITE_DISABLE_CAPTCHA === 'true' ||
      // import.meta.env.DEV || // Désactivé temporairement pour voir le captcha en dev
      typeof (window as any).Cypress !== 'undefined' // Tests Cypress
    )
  }

  // Déclaration globale pour TypeScript (évite les erreurs de linter)
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
            size?: 'normal' | 'compact'
          },
        ) => string
        remove: (widgetId: string) => void
        reset: (widgetId: string) => void
      }
      onloadTurnstileCallback?: () => void
    }
  }

  const renderWidget = () => {
    if (!window.turnstile || !widgetContainer.value) return

    // Nettoyage préventif
    if (widgetId.value) {
      window.turnstile.remove(widgetId.value)
    }

    try {
      if (!SITE_KEY) {
        console.error('VITE_CLOUDFLARE_SITE_KEY est manquant dans le .env')
        return
      }

      widgetId.value = window.turnstile.render(widgetContainer.value, {
        sitekey: SITE_KEY,
        theme: 'light',
        size: 'compact',
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
      console.error('Erreur chargement Turnstile:', e)
    }
  }

  onMounted(() => {
    // Mode dev/test : Auto-validation du CAPTCHA
    if (isCaptchaDisabled()) {
      if (import.meta.env.DEV) {
        console.info('ℹ️ CAPTCHA désactivé en mode développement')
      }
      // Émet automatiquement un token factice après un court délai
      setTimeout(() => {
        emit('verify', 'dev-captcha-bypass-token')
      }, 100)
      return
    }

    // Chargement dynamique du script Cloudflare s'il n'est pas là
    if (window.turnstile) {
      renderWidget()
    } else {
      window.onloadTurnstileCallback = renderWidget
      const script = document.createElement('script')
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  })

  onUnmounted(() => {
    if (window.turnstile && widgetId.value) {
      window.turnstile.remove(widgetId.value)
    }
  })

  // Exposer une méthode reset pour le parent (en cas d'erreur de login)
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
    gap: 6px;
    margin: 4px 0;
  }

  .turnstile-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    background: rgba(var(--primary-500-rgb), 0.06);
    border-radius: 20px;
  }

  .turnstile-icon {
    color: var(--primary-500);
  }

  .turnstile-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  /* Override du widget Cloudflare pour le rendre plus discret */
  :deep(.cf-turnstile) {
    transform: scale(0.9);
    transform-origin: center;

    iframe {
      border-radius: 8px !important;
    }
  }

  .error-text {
    color: @danger-500;
    font-size: 0.75rem;
    margin: 0;
  }
</style>
