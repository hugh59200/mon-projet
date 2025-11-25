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
      <main class="auth-overlay__container">
        <section class="auth-overlay__left">
          <div class="auth-overlay__brand">
            <div class="auth-overlay__brand-header">
              <img
                src="@/assets/logo-app.png"
                class="auth-overlay__brand-logo"
              />
              <BasicText
                size="h1"
                weight="bold"
                color="white"
                class="auth-overlay__brand-title"
              >
                Fast Peptides
              </BasicText>
            </div>
            <BasicText
              size="body-m"
              color="white"
              class="auth-overlay__brand-subtitle"
            >
              Accélérez la recherche biomoléculaire
              <br />
              avec précision et élégance 🔬
            </BasicText>
            <div class="auth-overlay__brand-illustration">
              <img
                src="@/assets/lab-illustration.jpg"
                class="auth-overlay__brand-image"
              />
            </div>
          </div>
        </section>

        <section class="auth-overlay__right">
          <div class="callback-wrapper">
            <div
              class="callback-card"
              v-motion="cardMotion"
            >
              <div
                v-if="state === 'loading'"
                class="state-block"
                v-motion="fadeIn"
              >
                <BasicLoader
                  size="large"
                  color="primary"
                />
                <BasicText
                  size="h4"
                  weight="bold"
                  color="neutral-900"
                >
                  Connexion sécurisée 🔐
                </BasicText>
                <BasicText
                  size="body-m"
                  color="neutral-600"
                >
                  Fast Peptides vérifie vos accès.
                  <br />
                  Un instant…
                </BasicText>
              </div>

              <div
                v-else-if="state === 'success'"
                class="state-block"
                v-motion="fadeInPop"
              >
                <BasicIconNext
                  name="CheckCircle2"
                  :size="82"
                  color="success-600"
                />
                <BasicText
                  size="h4"
                  weight="bold"
                  color="success-700"
                >
                  Connexion réussie ✅
                </BasicText>
                <BasicText
                  size="body-m"
                  color="neutral-600"
                >
                  {{ message || 'Redirection en cours…' }}
                </BasicText>
              </div>

              <div
                v-else
                class="state-block"
                v-motion="fadeIn"
              >
                <BasicIconNext
                  name="AlertTriangle"
                  :size="74"
                  color="danger-600"
                />
                <BasicText
                  size="h4"
                  weight="bold"
                  color="danger-700"
                >
                  Connexion impossible ❌
                </BasicText>
                <BasicText
                  size="body-m"
                  color="neutral-600"
                  class="error-message"
                >
                  {{ errorMessage }}
                </BasicText>

                <BasicButton
                  label="Se connecter manuellement"
                  variant="filled"
                  color="primary"
                  size="large"
                  @click="$router.push('/auth/login')"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import { supabase } from '@/supabase/supabaseClient'
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import BasicText from '@designSystem/components/basic/text/BasicText.vue'
  import type { EmailOtpType } from '@supabase/supabase-js'
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/useAuthStore'

  // ✅ UI state
  const visible = ref(true)
  const state = ref<'loading' | 'success' | 'error'>('loading')
  const errorMessage = ref('')
  const message = ref('')

  // ✅ Router/Auth
  const router = useRouter()
  const route = useRoute()
  const auth = useAuthStore()

  /* --- Motions --- */
  const fadeIn = {
    initial: { opacity: 0, y: 12 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.28 } },
  }
  const fadeInPop = {
    initial: { opacity: 0, scale: 0.6 },
    enter: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 120 } },
  }
  const cardMotion = {
    initial: { opacity: 0, scale: 0.94 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
  }

  function handleSuccess(user: any) {
    auth.user = user
    auth.fetchProfile().then(() => {
      state.value = 'success'
      message.value = `Bienvenue ${user.email} 👋`
      setTimeout(() => {
        visible.value = false
        router.replace(auth.isAdmin ? '/admin' : '/profil')
      }, 1500)
    })
  }

  onMounted(async () => {
    // 1️⃣ Cas OAuth (Google, Github...) : Code dans l'URL
    const code = route.query.code as string | undefined
    if (code) {
      // Supabase gère l'échange du code automatiquement, on attend juste la session
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        return handleSuccess(data.session.user)
      }
    }

    // 2️⃣ Cas Magic Link / Email Confirm : Token + Type
    const token = route.query.token as string | undefined
    const type = route.query.type as EmailOtpType | undefined

    if (token && type) {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type,
      })

      if (verifyError) {
        state.value = 'error'
        errorMessage.value = 'Le lien est invalide ou a expiré.'
        return
      }

      // Vérification réussie, on récupère la session
      const { data } = await supabase.auth.getSession()
      if (data.session?.user) {
        return handleSuccess(data.session.user)
      }
    }

    // 3️⃣ Cas Fallback : Session déjà active (OAuth implicite ou retour rapide)
    const { data: sessionData } = await supabase.auth.getSession()
    if (sessionData.session?.user) {
      return handleSuccess(sessionData.session.user)
    }

    // ❌ Si on arrive ici : Aucun moyen de connexion trouvé
    state.value = 'error'
    errorMessage.value = 'Aucune information de connexion valide trouvée.'
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
    overflow: hidden;

    &__backdrop {
      position: absolute;
      inset: 0;
      background: rgba(6, 10, 24, 0.35);
      backdrop-filter: blur(8px);
      pointer-events: none;
      z-index: 0;
    }

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
      position: relative;
      z-index: 1;
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
      position: relative;
      flex: 1;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__brand {
      text-align: left;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;

      &-header {
        display: flex;
        align-items: center;
        gap: 14px;
      }
      &-logo {
        width: 56px;
        height: 56px;
      }
      &-title {
        font-size: 26px;
        font-weight: 700;
      }
      &-subtitle {
        font-size: 16px;
        opacity: 0.92;
        line-height: 1.5;
        margin: 20px 0 40px;
      }
      &-illustration {
        display: flex;
        justify-content: center;
        align-items: flex-end;
        flex-grow: 1;
      }
      &-image {
        width: 100%;
        max-width: 360px;
        border-radius: 12px;
        background: #f8f9fa;
        padding: 12px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        animation: float 6s ease-in-out infinite;
      }
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

  @keyframes float {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-6px);
    }
  }

  .callback-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
  }
  .callback-card {
    width: 100%;
    padding: 20px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .state-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }
  .error-message {
    max-width: 260px;
    margin: 0 auto;
    line-height: 1.45;
    margin-bottom: 6px;
  }
</style>
