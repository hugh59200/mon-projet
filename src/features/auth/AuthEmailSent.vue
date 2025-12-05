<template>
  <div class="auth">
    <div class="auth__icon-wrapper">
      <BasicIconNext
        name="Mail"
        color="primary-600"
        :size="64"
      />
    </div>

    <h1 class="auth__title">{{ t('auth.emailSent.title') }}</h1>
    <p class="auth__subtitle">
      {{ t('auth.emailSent.subtitle') }}
      <br />
      {{ t('auth.emailSent.description') }}
    </p>
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
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
