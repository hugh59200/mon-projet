<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.register.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.register.subtitle') }}
    </p>

    <form class="auth__form" @submit.prevent="submit">
      <div class="auth__field">
        <WrapperInput
          v-model.trim="fields.email.value.value"
          :label="t('auth.register.email')"
          :placeholder="t('auth.placeholders.email')"
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
          :label="t('auth.register.password')"
          :placeholder="t('auth.placeholders.password')"
          :hint="t('auth.hints.passwordNew')"
          autocomplete="new-password"
          required
          :showStrength="false"
          :alertLabel="fields.password.wrapperProps.value.alertLabel"
          :alertType="fields.password.wrapperProps.value.alertType"
          :touched="fields.password.touched.value"
          @input="(e: Event) => { fields.password.onInput(e); clear() }"
          @blur="fields.password.onBlur"
        />
      </div>

      <div class="auth__field">
        <WrapperInputPassword
          v-model="fields.confirmPassword.value.value"
          :label="t('auth.register.confirmPassword')"
          :placeholder="t('auth.placeholders.password')"
          :hint="t('auth.hints.confirmPassword')"
          autocomplete="new-password"
          required
          :showStrength="false"
          :alertLabel="fields.confirmPassword.wrapperProps.value.alertLabel"
          :alertType="fields.confirmPassword.wrapperProps.value.alertType"
          :touched="fields.confirmPassword.touched.value"
          @input="(e: Event) => { fields.confirmPassword.onInput(e); clear() }"
          @blur="fields.confirmPassword.onBlur"
        >
          <template #suffix>
            <ValidationIcon :status="fields.confirmPassword.status.value" />
          </template>
        </WrapperInputPassword>
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
        :label="t('auth.register.submit')"
        icon-left="UserPlus"
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
    </form>

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
  import ValidationIcon from '@designSystem/components/basic/validationIcon/ValidationIcon.vue'
  import type { FieldHelpers } from '@/composables/validation'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useAuthForm } from './composables/useAuthForm'
  import { useAuthStore } from './stores/useAuthStore'

  const { t, locale } = useI18n()
  const auth = useAuthStore()
  const router = useRouter()

  const { fields, canSubmit, validate } = useAuthForm({
    mode: 'register',
    minPasswordStrength: 2,
  }) as ReturnType<typeof useAuthForm> & {
    fields: {
      email: FieldHelpers<string>
      password: FieldHelpers<string>
      confirmPassword: FieldHelpers<string>
    }
  }

  const loading = ref(false)
  const error = ref('')

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
    const isValid = await validate()
    if (!isValid) return

    if (!captchaToken.value) {
      error.value = t('auth.errors.captchaRequired')
      return
    }

    loading.value = true

    const success = await auth.signUp(
      fields.email.value.value,
      fields.password.value.value,
      captchaToken.value,
      locale.value
    )

    loading.value = false

    if (!success) {
      error.value = auth.error ?? t('auth.errors.registrationFailed')
      captchaToken.value = ''
      turnstileWidget.value?.reset()
      return
    }

    router.push('/auth/email-sent')
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
    border: 1px solid var(--color-danger-200);
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
