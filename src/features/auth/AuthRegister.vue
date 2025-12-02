<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.register.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.register.subtitle') }}
    </p>

    <form class="auth__form" @submit.prevent="submit">
      <!-- Email avec validation visuelle -->
      <div class="auth__field">
        <WrapperInput
          v-model.trim="fields.email.value.value"
          :label="t('auth.register.email')"
          placeholder="nom@entreprise.com"
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

      <!-- Password avec indicateur de force -->
      <div class="auth__field">
        <WrapperInputPassword
          v-model="fields.password.value.value"
          :label="t('auth.register.password')"
          placeholder="••••••••"
          autocomplete="new-password"
          required
          :showStrength="false"
          :alertLabel="fields.password.wrapperProps.value.alertLabel"
          :touched="fields.password.touched.value"
          @input="clear"
          @blur="fields.password.onBlur"
        />

        <!-- Indicateur de force premium -->
        <PasswordStrengthIndicator
          :model-value="fields.password.value.value"
          :min-strength="2"
          :show-checklist="true"
        />
      </div>

      <!-- Confirmation mot de passe -->
      <div class="auth__field">
        <WrapperInputPassword
          v-model="fields.confirmPassword.value.value"
          :label="t('auth.register.confirmPassword')"
          placeholder="••••••••"
          autocomplete="new-password"
          required
          :showStrength="false"
          :alertLabel="fields.confirmPassword.wrapperProps.value.alertLabel"
          :touched="fields.confirmPassword.touched.value"
          @input="clear"
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

      <BasicButton
        htmlType="submit"
        :label="t('auth.register.submit')"
        variant="filled"
        size="large"
        :disabled="loading || !captchaToken || !canSubmit"
        :loading="loading"
        block
      />

      <!-- Error feedback premium -->
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
  import PasswordStrengthIndicator from '@designSystem/components/basic/passwordStrength/PasswordStrengthIndicator.vue'
  import type { FieldHelpers } from '@/composables/validation'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'
  import { useAuthForm } from './composables/useAuthForm'
  import { useAuthStore } from './stores/useAuthStore'

  const { t } = useI18n()
  const auth = useAuthStore()
  const router = useRouter()

  // Formulaire avec validation premium
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

  // Captcha
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
    // 1. Validation formulaire
    const isValid = await validate()
    if (!isValid) return

    // 2. Sécurité Bot
    if (!captchaToken.value) {
      error.value = t('auth.errors.captchaRequired')
      return
    }

    loading.value = true

    // 3. Appel au store
    const success = await auth.signUp(
      fields.email.value.value,
      fields.password.value.value,
      captchaToken.value
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

  // Animations premium
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
