<template>
  <section class="auth-success">
    <transition name="fade">
      <div class="auth-success__card">
        <div class="auth-success__icon">
          <BasicIconNext
            name="CheckCircle"
            :size="20"
          />
        </div>

        <BasicText
          size="h4"
          weight="bold"
        >
          Mot de passe mis à jour ✅
        </BasicText>

        <BasicText
          size="body-m"
          color="neutral-500"
          class="auth-success__subtitle"
        >
          Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous reconnecter à
          votre compte.
        </BasicText>

        <BasicButton
          label="Se connecter"
          type="primary"
          variant="filled"
          size="medium"
          width="full"
          @click="router.push('/auth/login')"
        />
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router'

  const router = useRouter()
</script>

<style scoped lang="less">
  .auth-success {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 120px);
    background-color: @neutral-50;

    &__card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      padding: 40px 32px;
      max-width: 400px;
      width: 100%;
      text-align: center;
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
      color: var(--primary-700);
      margin-bottom: 8px;
    }

    &__subtitle {
      margin-bottom: 8px;
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
