<template>
  <section class="access-denied">
    <transition name="fade">
      <div class="access-denied__card">
        <div class="access-denied__icon">
          <BasicIconNext
            name="ShieldAlert"
            :size="20"
          />
        </div>

        <BasicText
          size="h4"
          weight="bold"
        >
          Accès refusé 🚫
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-500"
          class="access-denied__subtitle"
        >
          Vous n’avez pas les droits nécessaires pour accéder à cette page.
        </BasicText>

        <BasicText
          size="body-s"
          color="neutral-500"
        >
          Si vous pensez qu’il s’agit d’une erreur, contactez un administrateur ou revenez à la page
          d’accueil.
        </BasicText>

        <BasicButton
          label="Retour à l’accueil"
          type="primary"
          variant="filled"
          size="medium"
          width="full"
          @click="goHome"
        />
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const goHome = () => router.replace('/')
</script>

<style scoped lang="less">
  .access-denied {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 120px);
    background-color: @neutral-50;
    text-align: center;

    &__card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 40px 32px;
      max-width: 420px;
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 16px;
      align-items: center;
      animation: fadeInUp 0.4s ease forwards;
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      color: @warning-600;
      margin-bottom: 8px;
    }

    &__subtitle {
      margin-bottom: 4px;
    }

    button {
      margin-top: 8px;
    }
  }

  /* ✨ Animations */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
