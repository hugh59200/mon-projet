<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.register.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.register.subtitle') }}
    </p>

    <div class="auth__form">
      <WrapperInput
        v-model.trim="email"
        :label="t('auth.register.email')"
        placeholder="nom@entreprise.com"
        inputmode="email"
        iconName="Mail"
        required
        :alertLabel="touched.email ? errors.email : ''"
        @input="clear"
        @blur="validateField('email')"
        deletable
      />

      <WrapperInputPassword
        v-model="password"
        :label="t('auth.register.password')"
        placeholder="••••••••"
        required
        minStrength="strong"
        :alertLabel="errors.password"
        :touched="touched.password"
        deletable
        @input="clear"
        @blur="validateField('password')"
      />

      <Turnstile
        ref="turnstileWidget"
        @verify="onCaptchaVerify"
        @expire="onCaptchaExpire"
      />

      <BasicButton
        :label="t('auth.register.submit')"
        variant="filled"
        size="large"
        :disabled="loading || !captchaToken"
        :loading="loading"
        @click="submit"
      />

      <div class="auth__feedback">
        <transition
          name="fade"
          mode="out-in"
        >
          <BasicText
            v-if="error"
            size="body-s"
            color="danger-500"
            class="auth__error"
          >
            {{ error }}
          </BasicText>
        </transition>
      </div>
    </div>

    <div class="auth__links">
      <span>
        {{ t('auth.register.alreadyAccount') }}
        <RouterLink to="/auth/login">{{ t('auth.register.login') }}</RouterLink>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Turnstile from '@/features/auth/components/TurnstileWidget.vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useForm } from './composables/useForm'
  import { useAuthStore } from './stores/useAuthStore'

  const { t } = useI18n()
  const auth = useAuthStore()
  const router = useRouter()

  const { email, password, errors, touched, validate, validateField } = useForm(true, 'strong')

  const loading = ref(false)
  const error = ref('')

  // 🔐 État du Captcha
  const captchaToken = ref('')
  const turnstileWidget = ref()

  function onCaptchaVerify(token: string) {
    captchaToken.value = token
    error.value = ''
  }

  function onCaptchaExpire() {
    captchaToken.value = ''
  }

  function clear() {
    error.value = ''
    auth.clearError()
  }

  async function submit() {
    if (!validate('register')) return

    if (!captchaToken.value) {
      error.value = t('auth.errors.captchaRequired')
      return
    }

    loading.value = true

    // Appel au store mis à jour avec le token
    const success = await auth.signUp(email.value, password.value, captchaToken.value)

    loading.value = false

    if (!success) {
      error.value = auth.error ?? t('auth.errors.registrationFailed')
      // Reset du widget en cas d'échec (ex: email déjà pris)
      captchaToken.value = ''
      turnstileWidget.value?.reset()
      return
    }

    router.push('/auth/email-sent')
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';
</style>
