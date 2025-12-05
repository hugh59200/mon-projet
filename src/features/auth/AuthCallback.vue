<template>
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
  import { createWelcomePromo } from '@/api/supabase/autoPromo'
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

    const code = route.query.code as string | undefined
    if (code) {
      const { user } = await getSession()
      if (user) return handleSuccess(user)
    }

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

    const { user } = await getSession()
    if (user) return handleSuccess(user)

    fail(t('auth.callback.noSession'))
  })

  onUnmounted(() => {
    setTimeout(() => loader.hide(), 150)
  })

  async function handleSuccess(user: any) {
    auth.user = user
    await auth.fetchProfile()

    // Envoyer le code promo de bienvenue si c'est une nouvelle inscription
    const type = route.query.type as string | undefined
    if (type === 'signup' || type === 'email') {
      createWelcomePromo(user.id, user.email).catch(console.error)
    }

    const storedRedirect = sessionStorage.getItem('redirectAfterOAuth')
    const userRole = auth.profile?.role || 'user'
    const redirectUrl = getPostLoginRedirect(userRole, storedRedirect || null)
    sessionStorage.removeItem('redirectAfterOAuth')

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
