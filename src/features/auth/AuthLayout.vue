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

      <div class="visual-center-wrapper">
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

    <main class="auth-form-container">
      <div
        v-if="!isDesktop"
        class="mobile-header"
      >
        <div
          class="mobile-logo-wrapper"
          @click="$router.push('/')"
        >
          <BasicIconNext
            name="fastPeptides"
            :size="32"
            class="mobile-logo-icon"
          />
          <div class="logo-text-container mobile-text-size">
            <span class="brand-fast text-dark">Fast</span>
            <span class="brand-peptides">Peptides</span>
          </div>
        </div>
      </div>

      <div
        v-if="showSkip"
        class="skip-container"
      >
        <PremiumButton
          type="secondary"
          variant="ghost"
          size="sm"
          label="Continuer sans compte"
          icon-right="ArrowRight"
          @click="$router.push('/')"
        />
      </div>

      <div class="auth-form-wrapper">
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
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { isDesktop } = useDeviceBreakpoint()

  const showSkip = computed(() => {
    return !['auth-callback', 'email-sent'].includes(route.name as string)
  })
</script>

<style scoped lang="less">
  .auth-layout {
    display: flex;
    min-height: 100vh;
    width: 100%;
    background: white;
    overflow-x: hidden;
  }

  /* =========================================
   🎨 SECTION VISUELLE (GAUCHE - DESKTOP)
   ========================================= */
  .auth-visual {
    width: 45%;
    height: 100vh;
    position: relative;
    background-color: var(--secondary-900);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

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
      transform: scale(1.1) rotate(5deg);
    }
  }

  /* --- LOGO COMMON --- */
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

  .visual-center-wrapper {
    position: relative;
    z-index: 5;
    width: 100%;
    max-width: 480px;
    padding: 20px;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(12px);
    border-radius: 24px;
    padding: 40px;
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
      transition: transform 6s ease;
    }
    &:hover .illustration-img {
      transform: scale(1.08);
    }
  }

  /* =========================================
   📝 SECTION FORMULAIRE (DROITE + MOBILE)
   ========================================= */
  .auth-form-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    background: #ffffff;
    padding: 40px 20px;

    /* ✅ FOND AMÉLIORÉ : Points + Glow en haut */
    background-image:
      radial-gradient(circle at 50% 0%, rgba(var(--primary-500-rgb), 0.08), transparent 40%),
      radial-gradient(#cbd5e1 1px, transparent 1px);
    background-size:
      100% 100%,
      24px 24px;
    background-repeat: no-repeat, repeat;
  }

  .auth-form-wrapper {
    width: 100%;
    max-width: 420px;
    z-index: 2;
    padding: 20px;
  }

  /* 📱 MOBILE HEADER REVAMPED */
  .mobile-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 30px 20px 0; /* Plus d'espace en haut */
    display: flex;
    justify-content: center; /* ✅ CENTRÉ sur mobile */
    z-index: 10;
  }

  .mobile-logo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    cursor: pointer;

    /* Suppression de la pillule blanche, on assume le fond */

    .mobile-logo-icon {
      color: var(--primary-600) !important;
      filter: drop-shadow(
        0 4px 10px rgba(var(--primary-500-rgb), 0.3)
      ); /* Petit glow sur l'icône */
    }

    .mobile-text-size {
      font-size: 22px; /* Plus gros sur mobile */
    }

    /* ✅ FORCE LA COULEUR FONCÉE */
    .brand-fast.text-dark {
      color: #1e293b !important; /* Slate 800 - Très lisible */
    }
    /* .brand-peptides garde sa couleur primary définie plus haut */
  }

  /* Bouton Skip */
  .skip-container {
    position: absolute;
    top: 30px;
    right: 30px;
    z-index: 10;
  }

  .btn-skip {
    display: flex;
    align-items: center;
    gap: 8px;
    background: @white;
    border: 1px solid @neutral-300;
    color: @neutral-700;
    font-weight: 700;
    font-size: 0.9rem;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

    &:hover {
      border-color: var(--primary-500);
      color: var(--primary-600);
      background: @white;
      box-shadow: 0 6px 12px -2px rgba(var(--primary-500-rgb), 0.15);
      transform: translateY(-2px);
    }

    svg {
      transition: transform 0.2s;
    }
    &:hover svg {
      transform: translateX(4px);
    }
  }

  @keyframes pulseGlow {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    100% {
      transform: scale(1.1);
      opacity: 0.9;
    }
  }

  /* Transitions */
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

  /* --- MEDIA QUERY MOBILE --- */
  @media (max-width: 1024px) {
    .skip-container {
      top: auto;
      bottom: 30px; /* On déplace le bouton "Continuer sans compte" en bas sur mobile pour ne pas gêner le logo */
      right: 0;
      left: 0;
      display: flex;
      justify-content: center;

      .btn-skip {
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
        padding: 10px 20px;
        font-size: 0.9rem;
        span {
          display: inline;
        } /* On réaffiche le texte car on est en bas */
      }
    }
  }
</style>
