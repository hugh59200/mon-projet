<template>
  <transition
    name="fade-overlay"
    appear
  >
    <div
      v-if="visible"
      class="auth-overlay"
    >
      <div class="auth-overlay__backdrop" />

      <main
        class="auth-overlay__container"
        key="main"
      >
        <section class="auth-overlay__left">
          <div class="auth-brand">
            <div class="auth-brand__header">
              <img
                src="@/assets/logo-app.png"
                alt="Logo Fast Peptides"
                class="auth-brand__logo"
              />
              <h1 class="auth-brand__title">Fast Peptides</h1>
            </div>
            <p class="auth-brand__subtitle">
              Accélérez la recherche biomoléculaire
              <br />
              avec précision et élégance 🔬
            </p>
            <div class="auth-brand__illustration">
              <img
                src="@/assets/lab-illustration.jpg"
                alt="Illustration laboratoire"
                class="auth-brand__image"
              />
            </div>
          </div>
        </section>

        <section class="auth-overlay__right">
          <AuthOverlaySuccess
            v-if="mode === 'success'"
            key="success"
          />

          <AuthOverlayEmailSent
            v-else-if="mode === 'signup'"
            key="signup"
          />

          <RouterView
            v-else
            v-slot="{ Component }"
            key="form"
          >
            <component :is="Component" />
          </RouterView>
        </section>
      </main>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import AuthOverlayEmailSent from './AuthOverlayEmailSent.vue'
  import AuthOverlaySuccess from './AuthOverlaySuccess.vue'
  import { useAuthStore } from './stores/useAuthStore'

  const router = useRouter()
  const route = useRoute()
  const auth = useAuthStore()

  const mode = ref<'form' | 'success' | 'signup'>('form')
  const visible = ref(true)

  onMounted(async () => {
    if (route.path === '/auth/callback') {
      if (route.query.mode === 'signup') {
        mode.value = 'signup'
        // Fermeture douce après 3s
        setTimeout(() => (visible.value = false), 2800)
        return
      }

      const { data, error } = await supabase.auth.getSession()
      if (error) return console.error('Erreur récupération session:', error)
      const session = data.session

      if (session?.user) {
        auth.user = session.user
        await auth.fetchProfile?.()
        mode.value = 'success'

        // ✅ Fermeture overlay + redirection fluide
        setTimeout(() => (visible.value = false), 2800)
        setTimeout(() => {
          const storedRedirect = sessionStorage.getItem('redirectAfterOAuth')
          const redirect = storedRedirect || (auth.isAdmin ? '/admin' : '/profil')
          sessionStorage.removeItem('redirectAfterOAuth')
          router.replace(redirect)
        }, 3200)
      } else {
        router.replace('/auth/login')
      }
    }
  })
</script>
<style scoped lang="less">
  .auth-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle at 50% 40%,
      rgba(255, 255, 255, 0.15),
      rgba(15, 23, 42, 0.45)
    );
    backdrop-filter: blur(14px) saturate(130%);
    animation: fadeIn 0.25s ease forwards;

    &__container {
      display: flex;
      flex-direction: row;
      width: 92%;
      max-width: 980px;
      min-height: 580px;
      background: #fff;
      border-radius: 22px;
      overflow: hidden;
      box-shadow:
        0 6px 24px rgba(0, 0, 0, 0.05),
        0 12px 40px rgba(15, 23, 42, 0.12);
    }

    &__left {
      flex: 1.1;
      background: linear-gradient(135deg, #00bfa6, #009688);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 50px 40px;
    }

    &__right {
      flex: 1;
      background: #fff;
      padding: 48px 52px 56px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }

    @media (max-width: 860px) {
      &__container {
        flex-direction: column;
        width: 95%;
        max-width: 480px;
      }
      &__left {
        display: none;
      }
    }
  }

  .auth-brand {
    text-align: left;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    &__header {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    &__logo {
      width: 56px;
      height: 56px;
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
    }

    &__subtitle {
      font-size: 16px;
      opacity: 0.92;
      line-height: 1.5;
      margin: 20px 0 40px;
    }

    &__illustration {
      display: flex;
      justify-content: center;
      align-items: flex-end;
      flex-grow: 1;
    }

    &__image {
      width: 100%;
      max-width: 360px;
      border-radius: 12px;
      background: #f8f9fa;
      padding: 12px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
      animation: float 6s ease-in-out infinite;
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
  }

  .fade-scale-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .fade-scale-leave-from {
    opacity: 1;
    transform: scale(1);
  }

  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(1.05);
  }
</style>
