<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.reset.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.reset.subtitle') }}
    </p>

    <div class="auth__form">
      <WrapperInput
        v-model.trim="email"
        :label="t('auth.reset.email')"
        placeholder="nom@entreprise.com"
        inputmode="email"
        iconName="Mail"
        required
        :alertLabel="touched.email ? errors.email : ''"
        @input="clear"
        @blur="validateField('email')"
        deletable
      />

      <Turnstile
        ref="turnstileWidget"
        @verify="onCaptchaVerify"
        @expire="onCaptchaExpire"
      />

      <PremiumButton
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        :label="t('auth.reset.submit')"
        icon-left="Mail"
        :disabled="!captchaToken"
        :loading="loading"
        :loading-text="t('common.loading')"
        :shine="true"
        @click="submit"
      />

      <div class="auth__feedback">
        <transition
          name="fade"
          mode="out-in"
        >
          <BasicText
            v-if="error"
            key="error"
            size="body-s"
            color="danger-500"
            class="auth__error"
          >
            {{ error }}
          </BasicText>
          <BasicText
            v-else-if="message"
            key="message"
            size="body-s"
            color="success-600"
            class="auth__message"
          >
            {{ message }}
          </BasicText>
        </transition>
      </div>
    </div>

    <div class="auth__links">
      <RouterLink
        to="/auth/login"
        class="link-back"
      >
        <BasicIconNext
          name="ArrowLeft"
          :size="14"
        />
        {{ t('auth.reset.backToLogin') }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { resetPasswordForEmail } from '@/api'
  import Turnstile from '@/features/auth/components/TurnstileWidget.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useForm } from './composables/useForm'

  const { t } = useI18n()
  const { email, errors, touched, validate, validateField } = useForm(true, 'weak')

  const loading = ref(false)
  const error = ref('')
  const message = ref('')

  // 🔐 Logique Captcha
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
    message.value = ''
  }

  async function submit() {
    if (!validate('reset')) return

    if (!captchaToken.value) {
      error.value = t('auth.errors.captchaRequired')
      return
    }

    loading.value = true
    clear()

    const { error: err } = await resetPasswordForEmail({
      email: email.value,
      redirectTo: `${window.location.origin}/auth/update-password`,
      captchaToken: captchaToken.value,
    })

    loading.value = false

    if (err) {
      error.value = t('auth.errors.resetFailed')
      // Reset du captcha en cas d'erreur
      captchaToken.value = ''
      turnstileWidget.value?.reset()
    } else {
      message.value = t('auth.reset.success')
      email.value = ''
      // Optionnel : on peut reset le captcha ici aussi, mais comme l'utilisateur a réussi, c'est moins grave.
    }
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  .link-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
</style>
