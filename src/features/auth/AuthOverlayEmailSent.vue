<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="auth-email"
  >
    <div class="auth-email__icon-wrapper">
      <BasicIconNext
        name="Mail"
        color="primary-600"
        :size="72"
        class="auth-email__icon"
      />
    </div>

    <h1 class="auth-email__title">Vérifiez votre e-mail 📧</h1>
    <p class="auth-email__subtitle">
      Un lien de confirmation vient d’être envoyé à votre adresse.
      <br />
      Cliquez dessus pour activer votre compte Fast Peptides.
    </p>

    <AuthProgressBar color="primary" />
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted } from 'vue'
  import AuthProgressBar from '../shared/ProgressBar.vue'
  import { useAuthSound } from './composables/useAuthSound'

  const { email } = useAuthSound()

  onMounted(() => {
    email()
  })
</script>
<style scoped lang="less">
  .auth-email {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 40px;

    &__icon-wrapper {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      animation:
        popin 0.4s ease-out forwards,
        bounce-end 3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }

    &__title {
      font-size: 26px;
      font-weight: 700;
      margin-bottom: 12px;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      line-height: 1.5;
    }
  }

  @keyframes popin {
    0% {
      transform: scale(0.3);
      opacity: 0;
    }
    60% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes bounce-end {
    0%,
    90% {
      transform: scale(1);
    }
    95% {
      transform: scale(1.15);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
