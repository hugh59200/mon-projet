<template>
  <div class="auth-layout">
    <div class="auth-layout__container">
      <!-- 💡 Contenu de la page auth -->
      <transition
        name="fade-slide"
        appear
      >
        <div class="auth-layout__content">
          <slot />
        </div>
      </transition>
    </div>

    <!-- 🧠 Footer minimal -->
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
  .auth-layout {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    /* ✅ garantit une hauteur égale à la fenêtre visible */
    height: 100dvh;

    /* ✅ empêche tout scroll vertical */
    overflow: hidden;

    background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    box-sizing: border-box;
    padding: 0 16px;
  }

  /* ✅ Conteneur parfaitement centré */
  .auth-layout__container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    width: 100%;
    max-width: 420px;
  }

  /* ✅ Carte principale */
  .auth-layout__content {
    width: 100%;
    background: white;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
    padding: 40px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ✅ Footer collé en bas, toujours visible */
  .auth-layout__footer {
    width: 100%;
    text-align: center;
    padding: 12px 0 16px;
    font-size: 13px;
    color: @neutral-500;
    position: fixed;
    bottom: 0;
    left: 0;
    background: transparent;

    a {
      color: @primary-600;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  /* 💫 Animation fluide */
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
