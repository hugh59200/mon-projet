<template>
  <div class="auth-overlay">
    <div class="auth-overlay__backdrop" />

    <transition
      name="fade-scale"
      appear
    >
      <main class="auth-overlay__card">
        <slot />
      </main>
    </transition>
  </div>
</template>

<style scoped lang="less">
  .auth-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000; // au-dessus de tout
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(12px) saturate(130%);
    animation: fadeIn 0.25s ease forwards;

    &__backdrop {
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, rgba(15, 23, 42, 0.3), rgba(15, 23, 42, 0.45));
      pointer-events: none; // on bloque derrière
    }

    &__card {
      position: relative;
      z-index: 1;
      background: white;
      border-radius: 18px;
      padding: 40px 36px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  /* Animation d'apparition */
  .fade-scale-enter-active {
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-scale-enter-from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }

  /* Légère fade du backdrop */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
