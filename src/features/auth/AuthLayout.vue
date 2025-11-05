<template>
  <div class="auth-overlay">
    <div class="auth-overlay__backdrop" />

    <transition
      name="fade-scale"
      appear
    >
      <main class="auth-overlay__card">
        <!-- 🧠 Logo commun -->
        <div
          class="auth-logo"
          @click="$router.push('/')"
        >
          <img
            src="@/assets/logo-app.png"
            alt="Logo Fast Peptides"
            class="auth-logo__img"
          />
          <BasicText
            size="h3"
            weight="bold"
            color="neutral-700"
            class="auth-logo__text"
          >
            Fast Peptides
          </BasicText>
        </div>

        <!-- Vue enfant -->
        <RouterView />

        <!-- 🔙 Retour app -->
        <div class="auth-return">
          <BasicButton
            label="Retour à l’application"
            variant="outlined"
            width="full"
            size="medium"
            @click="$router.push('/')"
          />
        </div>
      </main>
    </transition>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  .auth-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(
      circle at 50% 40%,
      rgba(255, 255, 255, 0.15),
      rgba(15, 23, 42, 0.45)
    );
    backdrop-filter: blur(14px) saturate(130%);
    animation: fadeIn 0.25s ease forwards;

    &__card {
      position: relative;
      z-index: 1;
      background: #fff;
      border-radius: 22px;
      padding: 52px 44px 40px;
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow:
        0 4px 20px rgba(0, 0, 0, 0.04),
        0 12px 40px rgba(15, 23, 42, 0.12);
      transition:
        transform 0.3s ease,
        box-shadow 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow:
          0 8px 26px rgba(0, 0, 0, 0.05),
          0 14px 50px rgba(15, 23, 42, 0.15);
      }
    }
  }

  /* 🧬 Logo global */
  .auth-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 26px;
    cursor: pointer;
    caret-color: transparent;
    user-select: none;
    transition: opacity 0.2s ease;

    &__img {
      width: 46px;
      height: 46px;
      transition: transform 0.25s ease;
      &:hover {
        transform: scale(1.06);
      }
    }

    &__text {
      letter-spacing: 0.15px;
    }

    &:hover {
      opacity: 0.85;
    }
  }

  /* ❌ Bouton de fermeture */
  .auth-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: transparent;
    border: none;
    font-size: 22px;
    color: #475569;
    cursor: pointer;
    transition:
      color 0.25s ease,
      transform 0.2s ease;
    &:hover {
      color: #0f172a;
      transform: rotate(90deg);
    }
  }

  /* 🔙 Bouton bas */
  .auth-return {
    margin-top: 28px;
    width: 100%;
  }

  /* Animations */
  .fade-scale-enter-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
