<template>
  <div class="auth">
    <h1 class="auth__title">{{ t('auth.updatePassword.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.updatePassword.subtitle') }}
    </p>

    <form class="auth__form" @submit.prevent="submit">
      <div class="auth__field">
        <WrapperInputPassword
          v-model="password"
          :label="t('auth.updatePassword.password')"
          :placeholder="t('auth.placeholders.password')"
          :hint="t('auth.hints.passwordNew')"
          autocomplete="new-password"
          required
          :showStrength="false"
          @input="clearMessages"
        />

        <PasswordStrengthIndicator
          :model-value="password"
          :min-strength="2"
          :show-checklist="true"
        />
      </div>

      <div class="auth__field">
        <WrapperInputPassword
          v-model="confirmPassword"
          :label="t('auth.updatePassword.confirmPassword')"
          :placeholder="t('auth.placeholders.password')"
          :hint="t('auth.hints.confirmPassword')"
          autocomplete="new-password"
          required
          :showStrength="false"
          @input="clearMessages"
        />
      </div>

      <PremiumButton
        html-type="submit"
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        :label="t('auth.updatePassword.submit')"
        icon-left="Lock"
        :disabled="loading"
        :loading="loading"
        :loading-text="t('common.loading')"
        :shine="true"
      />

      <div class="auth__feedback">
        <Transition name="slide-fade" mode="out-in">
          <div v-if="error" class="auth__error-box">
            <BasicIconNext name="AlertCircle" :size="16" />
            <span>{{ error }}</span>
          </div>
          <div v-else-if="message" class="auth__success-box">
            <BasicIconNext name="CheckCircle" :size="16" />
            <span>{{ message }}</span>
          </div>
        </Transition>
      </div>
    </form>

    <div class="auth__links">
      <RouterLink to="/auth/login" class="link-back">
        <BasicIconNext name="ArrowLeft" :size="14" />
        {{ t('auth.reset.backToLogin') }}
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { updatePassword as updateUserPassword } from '@/api'
  import PasswordStrengthIndicator from '@designSystem/components/basic/passwordStrength/PasswordStrengthIndicator.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()

  const password = ref('')
  const confirmPassword = ref('')
  const loading = ref(false)
  const error = ref('')
  const message = ref('')

  function clearMessages() {
    error.value = ''
    message.value = ''
  }

  async function submit() {
    clearMessages()

    if (password.value.length < 6) {
      error.value = t('auth.errors.passwordTooShort')
      return
    }

    if (password.value !== confirmPassword.value) {
      error.value = t('auth.errors.passwordMismatch')
      return
    }

    loading.value = true

    const { error: err } = await updateUserPassword(password.value)

    loading.value = false

    if (err) {
      error.value = err.message
      return
    }

    message.value = t('auth.updatePassword.success')
    setTimeout(() => router.push('/auth/update-password-success'), 1500)
  }
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  .auth__field {
    position: relative;
  }

  .auth__error-box,
  .auth__success-box {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
  }

  .auth__error-box {
    background: var(--color-danger-50);
    border: 1px solid var(--color-danger-200);
    color: var(--color-danger-700);

    svg {
      flex-shrink: 0;
      color: var(--color-danger-500);
    }
  }

  .auth__success-box {
    background: var(--color-success-50);
    border: 1px solid var(--color-success-200);
    color: var(--color-success-700);

    svg {
      flex-shrink: 0;
      color: var(--color-success-500);
    }
  }

  .link-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
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
