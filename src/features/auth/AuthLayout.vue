<template>
  <div class="auth-layout">
    <aside
      v-if="isDesktop"
      class="auth-visual"
    >
      <div class="auth-visual__bg"></div>
      <div class="auth-visual__glow"></div>

      <div
        class="brand-badge"
        @click="$router.push('/')"
      >
        <BasicIconNext
          name="fastPeptides"
          :size="32"
          class="logo-img"
        />
        <div class="logo-text-container">
          <span class="brand-fast">Fast</span>
          <span class="brand-peptides">Peptides</span>
        </div>
      </div>

      <div class="visual-content">
        <div class="glass-card">
          <h1 class="hero-title">
            L'excellence
            <br />
            <span class="text-gradient">Biomoléculaire.</span>
          </h1>
          <p class="hero-subtitle">
            Accédez à un catalogue certifié pour vos recherches. Pureté garantie, livraison rapide
            et support expert.
          </p>
          <div class="illustration-wrapper">
            <img
              src="@/assets/lab-illustration.jpg"
              alt="Lab"
              class="illustration-img"
            />
          </div>
        </div>
      </div>

      <div class="auth-visual__footer">
        <p>© {{ new Date().getFullYear() }} Fast Peptides &mdash; Research Use Only</p>
      </div>
    </aside>

    <main class="auth-main">
      <!-- Boutons en haut (tablette/mobile) -->
      <div
        v-if="!isDesktop"
        class="mobile-header"
      >
        <PremiumButton
          v-if="isLoginPage"
          type="secondary"
          variant="outline"
          size="sm"
          :label="t('auth.login.createAccount')"
          icon-left="UserPlus"
          @click="$router.push('/auth/register')"
        />
        <PremiumButton
          v-else-if="isRegisterPage"
          type="secondary"
          variant="outline"
          size="sm"
          :label="t('auth.register.login')"
          icon-left="LogIn"
          @click="$router.push('/auth/login')"
        />
        <PremiumButton
          v-if="showSkip"
          type="primary"
          variant="outline"
          size="sm"
          label="Catalogue"
          icon-right="ArrowRight"
          class="mobile-skip-btn"
          @click="$router.push('/')"
        />
      </div>

      <!-- Bouton Créer un compte / Se connecter (gauche) -->
      <div
        v-if="showSkip && isDesktop && (isLoginPage || isRegisterPage)"
        class="auth-switch-container"
      >
        <PremiumButton
          v-if="isLoginPage"
          type="secondary"
          variant="outline"
          size="md"
          :label="t('auth.login.createAccount')"
          icon-left="UserPlus"
          @click="$router.push('/auth/register')"
        />
        <PremiumButton
          v-else-if="isRegisterPage"
          type="secondary"
          variant="outline"
          size="md"
          :label="t('auth.register.login')"
          icon-left="LogIn"
          @click="$router.push('/auth/login')"
        />
      </div>

      <!-- Bouton Voir le catalogue (droite) -->
      <div
        v-if="showSkip && isDesktop"
        class="skip-container"
      >
        <PremiumButton
          type="primary"
          variant="outline"
          size="md"
          label="Voir le catalogue"
          icon-right="ArrowRight"
          @click="$router.push('/')"
        />
      </div>

      <!-- Conteneur principal : form (tablette/mobile) -->
      <div
        v-if="!isDesktop"
        class="mobile-content"
      >
        <div class="form-wrapper">
          <router-view v-slot="{ Component }">
            <transition
              name="fade-slide"
              mode="out-in"
            >
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>

      <!-- Desktop form wrapper -->
      <div
        v-if="isDesktop"
        class="form-wrapper"
      >
        <router-view v-slot="{ Component }">
          <transition
            name="fade-slide"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint'
  import BasicIconNext from '@designSystem/components/basic/icon/BasicIconNext.vue'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute } from 'vue-router'

  const { t } = useI18n()
  const route = useRoute()
  const { isDesktop } = useDeviceBreakpoint()

  const showSkip = computed(() => {
    return !['auth-callback', 'email-sent'].includes(route.name as string)
  })

  const isLoginPage = computed(() => route.name === 'auth-login')
  const isRegisterPage = computed(() => route.name === 'auth-register')
</script>

<style scoped lang="less">
  /* ===========================================
     LAYOUT PRINCIPAL
     =========================================== */
  .auth-layout {
    display: grid;
    grid-template-columns: 45% 1fr;
    align-items: center; // Aligne les contenus des deux panneaux sur le même axe horizontal
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: var(--bg-page);
  }

  /* ===========================================
     PANNEAU VISUEL (DESKTOP)
     =========================================== */
  .auth-visual {
    height: 100%;
    position: relative;
    background-color: var(--secondary-900);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &__bg {
      position: absolute;
      inset: 0;
      opacity: 0.3;
      background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
      background-size: 30px 30px;
      z-index: 0;
    }

    &__glow {
      position: absolute;
      top: -30%;
      left: -30%;
      width: 160%;
      height: 160%;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(var(--primary-500-rgb), 0.15),
        transparent 70%
      );
      z-index: 1;
      animation: pulseGlow 10s ease-in-out infinite alternate;
    }

    &__footer {
      position: absolute;
      bottom: 30px;
      left: 40px;
      right: 40px;
      z-index: 10;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      text-align: center;
    }
  }

  .brand-badge {
    position: absolute;
    top: 40px;
    left: 40px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;

    .logo-img {
      color: white;
      transition: transform 0.25s ease;
    }
    &:hover .logo-img {
      transform: rotate(5deg);
    }
  }

  .logo-text-container {
    display: flex;
    align-items: center;
    gap: 4px;
    line-height: 1;
    font-size: 24px;
  }

  .brand-fast {
    font-weight: 900;
    font-style: italic;
    letter-spacing: -0.5px;
    color: white;
  }

  .brand-peptides {
    color: var(--primary-400);
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .visual-content {
    position: relative;
    z-index: 5;
    width: 100%;
    max-width: 540px;
    padding: 20px;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 28px;
    padding: 48px;
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.2),
      inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  .hero-title {
    font-size: 2.2rem;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
    color: white;

    .text-gradient {
      background: linear-gradient(135deg, @white 0%, var(--primary-400) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .hero-subtitle {
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.65);
    margin-bottom: 30px;
  }

  .illustration-wrapper {
    width: 100%;
    height: 200px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.05);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(var(--secondary-900-rgb), 0.6));
    }

    .illustration-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  /* ===========================================
     PANNEAU FORMULAIRE
     =========================================== */
  .auth-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    padding: 20px;
    overflow: hidden;
    background-color: var(--bg-page);
    background-image: radial-gradient(var(--border-default) 1px, transparent 1px);
    background-size: 24px 24px;
  }

  .form-wrapper {
    width: 100%;
    max-width: 480px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  /* ===========================================
     BOUTONS NAVIGATION DESKTOP
     =========================================== */
  .auth-switch-container {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 10;

    :deep(.pbtn:hover) {
      transform: none !important;
    }
  }

  .skip-container {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 10;

    :deep(.pbtn:hover) {
      transform: none !important;
    }
  }

  /* ===========================================
     MOBILE / TABLET
     =========================================== */
  .mobile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px 20px;
    padding-top: calc(16px + env(safe-area-inset-top, 0px));
    flex-shrink: 0;
    z-index: 10;
  }

  .mobile-skip-btn {
    flex-shrink: 0;
    margin-left: auto;
  }

  .mobile-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    align-items: center;
    justify-content: center;
    min-height: 0;
    overflow: hidden;
  }

  /* ===========================================
     ANIMATIONS
     =========================================== */
  @keyframes pulseGlow {
    0% { opacity: 0.6; }
    100% { opacity: 0.9; }
  }

  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px) scale(0.98);
  }

  /* ===========================================
     RESPONSIVE TABLET / MOBILE
     =========================================== */
  .respond-tablet({
    .auth-layout {
      display: flex; // Repasse en flex sur mobile
      grid-template-columns: none;
      height: 100dvh;
    }

    .auth-main {
      flex: 1;
      height: 100dvh;
      padding: 12px;
      padding-top: env(safe-area-inset-top, 0px);
      padding-bottom: env(safe-area-inset-bottom, 0px);
      background-image: none; // Fond uni sur mobile
    }

    .mobile-content {
      justify-content: center;
    }

    .form-wrapper {
      flex: 1;
      min-height: 0;
      justify-content: center;
      padding: 0 16px; // Espace latéral
      width: 100%;
      box-sizing: border-box;
    }

    .mobile-header {
      padding: 10px 16px;
      padding-top: calc(10px + env(safe-area-inset-top, 0px));
    }

    .mobile-logo {
      padding: clamp(12px, 3vh, 24px) 0;

      &__icon {
        width: clamp(32px, 6vh, 48px) !important;
        height: clamp(32px, 6vh, 48px) !important;
      }

      &__text {
        font-size: clamp(24px, 5vh, 32px);
      }
    }

    .mobile-skip-btn :deep(.pbtn__label) {
      font-size: 0.8rem;
    }
  });
</style>
