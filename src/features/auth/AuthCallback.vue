<template>
  <!-- Error : affiche le layout auth complet (le loading est géré par AppLoaderOverlay) -->
  <div
    v-if="state === 'error'"
    class="auth"
  >
    <div class="auth__icon-wrapper">
      <BasicIconNext
        name="AlertTriangle"
        :size="64"
        color="danger-500"
      />
    </div>
    <h1 class="auth__title">{{ t('auth.callback.invalidLink') }}</h1>
    <p class="auth__subtitle error-msg">{{ errorMessage }}</p>
    <div class="auth__form">
      <PremiumButton
        :label="t('auth.reset.backToLogin')"
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        icon-left="ArrowLeft"
        @click="$router.push('/auth/login')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { getSession, verifyOtp } from '@/api'
  import { useAppLoader } from '@/composables/useAppLoader'
  import { getPostLoginRedirect } from '@/router'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted, onUnmounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from './stores/useAuthStore'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const auth = useAuthStore()
  const loader = useAppLoader()

  const state = ref<'loading' | 'error'>('loading')
  const errorMessage = ref('')

  onMounted(async () => {
    loader.show(t('auth.callback.verifying'))

    // 1️⃣ Cas OAuth (Google, etc.) : code dans l'URL
    const code = route.query.code as string | undefined
    if (code) {
      const { user } = await getSession()
      if (user) return handleSuccess(user)
    }

    // 2️⃣ Cas Email Links (Signup / Reset Password) : token_hash + type
    const token = (route.query.token_hash as string) || (route.query.token as string)
    const type = route.query.type as any

    if (token && type) {
      const { error } = await verifyOtp({
        tokenHash: token,
        type: type,
      })

      if (error) {
        fail(
          type === 'recovery'
            ? t('auth.callback.linkExpired')
            : t('auth.callback.invalidValidation'),
        )
        return
      }

      const { user } = await getSession()
      if (user) return handleSuccess(user)
    }

    // 3️⃣ Cas Fallback : Déjà connecté ?
    const { user } = await getSession()
    if (user) return handleSuccess(user)

    // ❌ Échec
    fail(t('auth.callback.noSession'))
  })

  onUnmounted(() => {
    // Délai pour laisser la nouvelle page se rendre avant de cacher le loader
    setTimeout(() => loader.hide(), 150)
  })

  async function handleSuccess(user: any) {
    auth.user = user
    await auth.fetchProfile()

    // Redirection immédiate basée sur le rôle
    const storedRedirect = sessionStorage.getItem('redirectAfterOAuth')
    const userRole = auth.profile?.role || 'user'
    const redirectUrl = getPostLoginRedirect(userRole, storedRedirect || null)
    sessionStorage.removeItem('redirectAfterOAuth')

    // Ne pas cacher le loader ici - il restera visible pendant la navigation
    // et sera caché par onUnmounted ou par la page de destination
    router.replace(redirectUrl)
  }

  function fail(msg: string) {
    loader.hide()
    state.value = 'error'
    errorMessage.value = msg
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  .error-msg {
    color: @danger-500;
  }
</style>
