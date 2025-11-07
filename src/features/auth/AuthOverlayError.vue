<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="auth-error"
  >
    <div class="auth-error__icon-wrapper">
      <BasicIconNext
        name="AlertCircle"
        color="danger-600"
        :size="72"
        class="auth-error__icon"
      />
    </div>

    <h1 class="auth-error__title">Échec de la connexion ❌</h1>
    <p class="auth-error__subtitle">
      Une erreur est survenue pendant la validation de votre compte.
      <br />
      Veuillez réessayer ou vérifier votre adresse e-mail.
    </p>

    <BasicButton
      label="Réessayer"
      variant="filled"
      size="large"
      color="danger"
      class="auth-error__cta"
      @click="$router.push('/auth/login')"
    />
  </div>
</template>

<script setup lang="ts">
  import BasicButton from '@designSystem/components/basic/button/BasicButton.vue'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
</script>
<style scoped lang="less">
  .auth-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 60px;

    &__icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      animation:
        shake-in 0.5s cubic-bezier(0.36, 0, 0.66, -0.56) forwards,
        pulse-danger 3s ease-in-out infinite 2s;
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 12px;
      color: @danger-700;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      margin-bottom: 24px;
      line-height: 1.5;
    }

    &__cta {
      margin-top: 4px;
    }
  }

  /* apparition "secouée" */
  @keyframes shake-in {
    0% {
      transform: scale(0.3) rotate(0deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.1) rotate(-5deg);
      opacity: 1;
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  /* petit battement rouge subtil après */
  @keyframes pulse-danger {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
  }
</style>
