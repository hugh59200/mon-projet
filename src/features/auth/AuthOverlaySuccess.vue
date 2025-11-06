<template>
  <div
    v-motion="{
      initial: { opacity: 0, y: 20 },
      enter: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
    }"
    class="auth-success"
  >
    <!-- ✅ Icône animée -->
    <div class="auth-success__icon-wrapper">
      <BasicIconNext
        name="CheckCircle2"
        color="success-600"
        :size="72"
        class="auth-success__icon"
      />
    </div>

    <h1 class="auth-success__title">Connexion réussie 🎉</h1>
    <p class="auth-success__subtitle">
      Bienvenue à nouveau dans votre espace Fast Peptides.
      <br />
      Vous pouvez continuer vos analyses dès maintenant !
    </p>

    <AuthProgressBar />
  </div>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { onMounted } from 'vue'
  import AuthProgressBar from './AuthProgressBar.vue'
  import { useAuthSound } from './composables/useAuthSound'
  const { success } = useAuthSound()

  onMounted(() => {
    success()
  })
</script>

<style scoped lang="less">
  .auth-success {
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

  /* --- Animations --- */

  /* apparition du check */
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

  /* petit rebond final (vers 2.8 s, quand la barre se termine) */
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
