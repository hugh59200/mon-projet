<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.login.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.login.subtitle') }}
    </p>

    <form class="auth__form" @submit.prevent="submit">
      <div class="auth__field">
        <WrapperInput
          v-model.trim="fields.email.value.value"
          :label="t('auth.login.email')"
          :placeholder="t('auth.placeholders.email')"
          :hint="t('auth.hints.emailLogin')"
          inputmode="email"
          autocomplete="email"
          iconName="Mail"
          required
          :alertLabel="fields.email.wrapperProps.value.alertLabel"
          :alertType="fields.email.wrapperProps.value.alertType"
          @input="(e: Event) => { fields.email.onInput(e); clear() }"
          @blur="fields.email.onBlur"
          deletable
        >
          <template #suffix>
            <ValidationIcon :status="fields.email.status.value" />
          </template>
        </WrapperInput>
      </div>

      <div class="auth__field">
        <WrapperInputPassword
          v-model="fields.password.value.value"
          :label="t('auth.login.password')"
          :placeholder="t('auth.placeholders.password')"
          :hint="t('auth.hints.password')"
          autocomplete="current-password"
          required
          :showStrength="false"
          :alertLabel="fields.password.wrapperProps.value.alertLabel"
          :alertType="fields.password.wrapperProps.value.alertType"
          :touched="fields.password.touched.value"
          @input="(e: Event) => { fields.password.onInput(e); clear() }"
          @blur="fields.password.onBlur"
        />
      </div>

      <Turnstile
        ref="turnstileWidget"
        @verify="onCaptchaVerify"
        @expire="onCaptchaExpire"
      />

      <PremiumButton
        html-type="submit"
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        :label="t('auth.login.submit')"
        icon-left="LogIn"
        :disabled="!captchaToken || !canSubmit"
        :loading="loading"
        :loading-text="t('common.loading')"
        :shine="true"
        :glow="!!(captchaToken && canSubmit && !loading)"
      />

      <div class="auth__feedback">
        <Transition name="slide-fade" mode="out-in">
          <div v-if="error" class="auth__error-box">
            <BasicIconNext name="AlertCircle" :size="16" />
            <span>{{ error }}</span>
          </div>
        </Transition>
      </div>

      <div class="auth__divider"><span>{{ t('common.or') }}</span></div>

      <div class="auth__providers">
        <BasicSocialButton provider="google" @click="provider('google')" />
        <BasicSocialButton provider="github" @click="provider('github')" />
        <BasicSocialButton provider="facebook" @click="provider('facebook')" />
      </div>
    </form>

    <div class="auth__links">
      <span>
        {{ t('auth.login.noAccount') }}
        <RouterLink to="/auth/register">{{ t('auth.login.createAccount') }}</RouterLink>
      </span>
      <RouterLink to="/auth/reset-password">{{ t('auth.login.forgotPassword') }}</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Turnstile from '@/features/auth/components/TurnstileWidget.vue'
  import ValidationIcon from '@designSystem/components/basic/validationIcon/ValidationIcon.vue'
  import type { FieldHelpers } from '@/composables/validation'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BasicSocialButton from './BasicSocialButton.vue'
  import { useAuthForm } from './composables/useAuthForm'
  import { useAuthStore } from './stores/useAuthStore'

  const { t } = useI18n()
  const auth = useAuthStore()

  const { fields, canSubmit, validate } = useAuthForm({
    mode: 'login',
  }) as ReturnType<typeof useAuthForm> & {
    fields: {
      email: FieldHelpers<string>
      password: FieldHelpers<string>
    }
  }

  const error = ref('')
  const loading = ref(false)

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
    auth.error = null
  }

  async function submit() {
    const isValid = await validate()
    if (!isValid) return

    if (!captchaToken.value) {
      error.value = t('auth.errors.captchaRequired')
      return
    }

    loading.value = true

    const success = await auth.signIn(
      fields.email.value.value,
      fields.password.value.value,
      captchaToken.value
    )

    loading.value = false

    if (!success) {
      error.value = auth.error ?? t('auth.errors.invalidCredentials')
      captchaToken.value = ''
      turnstileWidget.value?.reset()
    }
  }

  async function provider(name: any) {
    loading.value = true
    await auth.signInWithProvider(name)
    loading.value = false
    if (auth.error) error.value = auth.error
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  .auth__field {
    position: relative;
  }

  .auth__error-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    background: var(--color-danger-50);
    border: 1px solid var(--color-danger-400); // Renforcé pour meilleur contraste
    border-radius: 10px;
    color: var(--color-danger-700);
    font-size: 14px;
    font-weight: 500;

    svg {
      flex-shrink: 0;
      color: var(--color-danger-500);
    }
  }

  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide-fade-enter-from {
    opacity: 0;
    transform: translateY(-10px);
  }

  .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
