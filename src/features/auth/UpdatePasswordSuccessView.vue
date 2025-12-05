<template>
  <div class="auth">
    <div class="auth__icon-wrapper">
      <BasicIconNext
        name="CheckCircle"
        color="success-500"
        :size="64"
      />
    </div>

    <h1 class="auth__title">{{ t('auth.updatePasswordSuccess.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.updatePasswordSuccess.subtitle') }}
    </p>

    <div class="auth__form">
      <PremiumButton
        type="primary"
        variant="solid"
        size="lg"
        width="full"
        :label="t('auth.updatePasswordSuccess.login')"
        icon-left="LogIn"
        :shine="true"
        @click="router.push('/auth/login')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  const { t } = useI18n()
  const router = useRouter()
</script>

<style scoped lang="less">
  @import './AuthFormStyles.less';

  .auth__icon-wrapper {
    animation: popin 0.4s ease-out forwards;
  }

  @keyframes popin {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    60% {
      transform: scale(1.05);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }
</style>
