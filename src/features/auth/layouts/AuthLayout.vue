<template>
  <div class="auth-layout">
    <div class="auth-layout__background"></div>

    <main class="auth-layout__main">
      <transition
        name="fade-slide"
        appear
      >
        <div class="auth-layout__content">
          <slot />
        </div>
      </transition>
    </main>

    <footer class="auth-layout__footer">
      <p>
        © {{ new Date().getFullYear() }} Fast Peptides —
        <RouterLink to="/">Accueil</RouterLink>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  /* 🌈 Layout principal */
  .auth-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background: linear-gradient(120deg, #f8fafc, #f1f5f9, #eef2ff);
    background-size: 300% 300%;
    animation: gradientShift 12s ease-in-out infinite alternate;
    overflow-x: hidden;
  }

  /* 🌤️ Halo lumineux doux */
  .auth-layout__background {
    position: fixed;
    inset: 0;
    background: radial-gradient(
      circle at var(--x, 30%) var(--y, 30%),
      rgba(99, 102, 241, 0.12),
      rgba(236, 72, 153, 0.08),
      rgba(255, 255, 255, 0)
    );
    filter: blur(80px);
    animation: haloDrift 20s ease-in-out infinite;
    pointer-events: none;
    z-index: 0;
  }

  /* 🧱 Zone principale */
  .auth-layout__main {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px 16px;
    z-index: 2;
  }

  /* 🪶 Carte centrale */
  .auth-layout__content {
    width: 100%;
    max-width: 420px;
    background: white;
    border-radius: 18px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
    padding: 40px 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.3s ease;

    @media (max-width: 800px) {
      padding: 32px 24px;
      border-radius: 14px;
    }

    @media (max-width: 480px) {
      padding: 24px 18px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
    }
  }

  /* 🧠 Footer */
  .auth-layout__footer {
    text-align: center;
    padding: 12px 0 18px;
    font-size: 13px;
    color: @neutral-500;
    z-index: 2;

    a {
      color: @primary-600;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* 💫 Animations */
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes haloDrift {
    0% {
      --x: 25%;
      --y: 30%;
    }
    25% {
      --x: 70%;
      --y: 25%;
    }
    50% {
      --x: 60%;
      --y: 70%;
    }
    75% {
      --x: 35%;
      --y: 60%;
    }
    100% {
      --x: 25%;
      --y: 30%;
    }
  }

  /* 🔮 Transitions */
  .fade-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .fade-slide-leave-active {
    transition: all 0.2s ease-in;
  }
  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-5px);
  }
</style>
