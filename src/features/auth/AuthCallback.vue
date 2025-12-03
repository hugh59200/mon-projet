<template>
  <div class="callback-page">
    <div
      v-if="state === 'loading'"
      class="status-block"
      v-motion-fade
    >
      <BasicLoader
        size="large"
        color="primary"
      />
      <h2 class="status-title">{{ t('auth.callback.loading') }}</h2>
      <p class="status-text">{{ t('auth.callback.verifying') }}</p>
    </div>
    <div
      v-else-if="state === 'success'"
      class="status-block"
      v-motion-pop
    >
      <BasicIconNext
        name="CheckCircle2"
        :size="64"
        color="success-600"
      />
      <h2 class="status-title text-success">{{ t('auth.callback.success') }}</h2>
      <p class="status-text">{{ message }}</p>
    </div>
    <div
      v-else
      class="status-block"
      v-motion-fade
    >
      <BasicIconNext
        name="AlertTriangle"
        :size="64"
        color="danger-600"
      />
      <h2 class="status-title text-danger">{{ t('auth.callback.invalidLink') }}</h2>
      <p class="status-text error-msg">{{ errorMessage }}</p>
      <PremiumButton
        :label="t('auth.reset.backToLogin')"
        type="primary"
        class="mt-4"
        @click="$router.push('/auth/login')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getSession, verifyOtp } from '@/api'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import BasicLoader from '@designSystem/components/basic/loader/BasicLoader.vue'
  import { onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/useAuthStore'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()

  const state = ref<'loading' | 'success' | 'error'>('loading')
  const message = ref('')
  const errorMessage = ref('')

  onMounted(async () => {
    // 1️⃣ Cas OAuth (Google, etc.) : code dans l'URL
    const code = route.query.code as string | undefined
    if (code) {
      const { user } = await getSession()
      if (user) return handleSuccess(user)
    }

    // 2️⃣ Cas Email Links (Signup / Reset Password) : token_hash + type
    // Lit la valeur du jeton à partir de 'token_hash' (nouveau format) ou 'token' (ancien)
    const token = (route.query.token_hash as string) || (route.query.token as string)
    const type = route.query.type as any

    if (token && type) {
      console.log(`Tentative de vérification OTP: ${token}, ${type}`)
      // Utilisation de verifyOtp (méthode Supabase attendue pour la vérification)
      const { error } = await verifyOtp({
        tokenHash: token,
        type: type,
      })
      console.log(error)
      if (error) {
        // Si le jeton est mauvais maintenant, c'est qu'il est expiré.
        fail(type === 'recovery' ? t('auth.callback.linkExpired') : t('auth.callback.invalidValidation'))
        return
      }
      // Session active après verifyOtp
      const { user } = await getSession()
      if (user) return handleSuccess(user)
    }

    // 3️⃣ Cas Fallback : Déjà connecté ?
    const { user } = await getSession()
    if (user) return handleSuccess(user)

    // ❌ Échec
    fail(t('auth.callback.noSession'))
  })

  function handleSuccess(user: any) {
    auth.user = user
    auth.fetchProfile().then(() => {
      state.value = 'success'
      message.value = `${t('auth.callback.welcome')} ${user.email}`

      // Redirection intelligente
      const redirectUrl =
        sessionStorage.getItem('redirectAfterOAuth') || (auth.isAdmin ? '/admin' : '/profil')
      sessionStorage.removeItem('redirectAfterOAuth')

      setTimeout(() => router.replace(redirectUrl), 1500)
    })
  }

  function fail(msg: string) {
    state.value = 'error'
    errorMessage.value = msg
  }
</script>

<style scoped>
  .callback-page {
    text-align: center;
    width: 100%;
  }
  .status-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .status-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: @neutral-900;
    margin: 0;
  }
  .status-text {
    color: @neutral-500;
    font-size: 1rem;
  }
  .error-msg {
    color: @danger-500;
    max-width: 300px;
  }
  .text-success {
    color: @success-600;
  }
  .text-danger {
    color: @danger-600;
  }
  .mt-4 {
    margin-top: 24px;
  }
</style>
