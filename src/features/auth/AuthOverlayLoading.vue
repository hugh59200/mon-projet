<template>
  <transition
    name="fade-scale"
    appear
  >
    <div class="auth-loading">
      <BasicIconNext
        name="Loader2"
        color="primary-600"
        :size="70"
        class="auth-loading__icon"
      />

      <h1 class="auth-loading__title">Connexion sécurisée en cours 🔐</h1>

      <p class="auth-loading__subtitle">
        Fast Peptides vérifie votre compte, un instant…
        <br />
        Ne fermez pas cette fenêtre.
      </p>
    </div>
  </transition>
</template>

<script setup lang="ts">
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
</script>

<style scoped lang="less">
  .auth-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 60px;
    animation: fadeIn 0.5s ease forwards;

    &__icon {
      margin-bottom: 18px;
      animation: spin 1.2s linear infinite;
    }

    &__title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 10px;
      color: @neutral-900;
    }

    &__subtitle {
      font-size: 15px;
      color: @neutral-600;
      line-height: 1.5;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(8px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  /* ✨ Transition fluide */
  .fade-scale-enter-active,
  .fade-scale-leave-active {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95);
  }
  .fade-scale-leave-to {
    opacity: 0;
    transform: scale(1.05);
  }
</style>
