<template>
  <!-- Niveau 1 : Wrapper pleine largeur -->
  <section class="hero">
    <!-- Fond absolu (pleine largeur) -->
    <div class="hero__bg">
      <div class="hero__bg-overlay"></div>
      <div class="hero__bg-grid"></div>
    </div>

    <!-- Niveau 2 : Wrapper image max-width 1200px -->
    <div class="hero__image-wrapper">
      <img
        :src="heroImage"
        alt="Fioles de peptides Fast Peptides"
        class="hero__image"
      />
    </div>

    <!-- Niveau 3 : Wrapper flex pour les éléments -->
    <div class="hero__content">
      <!-- Header : titre à gauche, badge à droite -->
      <div class="hero__header">
        <h1 class="hero__title">
          <span>{{ t('home.hero.title.line1') }}</span>
          <span class="hero__title-accent">{{ t('home.hero.title.accent') }}</span>
          <span v-if="!isMobile">{{ t('home.hero.title.line2') }}</span>
        </h1>

        <div class="hero__badge">
          <span class="hero__badge-dot"></span>
          <span>{{ t('home.hero.badge.certified') }}</span>
          <span
            v-if="!isMobile"
            class="hero__badge-sep"
          >
            •
          </span>
          <span v-if="!isMobile">{{ t('home.hero.badge.researchOnly') }}</span>
        </div>
      </div>

      <!-- Actions et trust -->
      <div class="hero__footer">
        <!-- Mobile : bouton + badges sur une ligne -->
        <div
          v-if="isMobile"
          class="hero__bottom-row"
        >
          <PremiumButton
            type="primary"
            variant="solid"
            size="md"
            :label="t('home.hero.cta.explore')"
            icon-right="ArrowRight"
            @click="$router.push('/catalogue')"
          />
          <div class="hero__trust-mobile">
            <div class="hero__trust-mobile-item">
              <BasicIconNext
                name="ShieldCheck"
                :size="16"
              />
            </div>
            <div class="hero__trust-mobile-item">
              <BasicIconNext
                name="FileText"
                :size="16"
              />
            </div>
            <div class="hero__trust-mobile-item">
              <BasicIconNext
                name="Zap"
                :size="16"
              />
            </div>
          </div>
        </div>

        <!-- Desktop : actions séparées -->
        <div
          v-if="!isMobile"
          class="hero__actions"
        >
          <PremiumButton
            type="primary"
            variant="solid"
            size="lg"
            :label="t('home.hero.cta.explore')"
            icon-right="ArrowRight"
            @click="$router.push('/catalogue')"
          />
          <PremiumButton
            type="secondary"
            variant="ghost"
            size="lg"
            :label="t('home.hero.cta.learnMore')"
            @click="$router.push('/a-propos')"
          />
        </div>

        <div
          v-if="!isMobile"
          class="hero__trust"
        >
          <div class="hero__trust-item">
            <BasicIconNext
              name="ShieldCheck"
              :size="18"
            />
            <span>{{ t('home.hero.trust.purity') }}</span>
          </div>
          <div class="hero__trust-item">
            <BasicIconNext
              name="FileText"
              :size="18"
            />
            <span>{{ t('home.hero.trust.coa') }}</span>
          </div>
          <div class="hero__trust-item">
            <BasicIconNext
              name="Zap"
              :size="18"
            />
            <span>{{ t('home.hero.trust.delivery') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import peptidesHeroMobileImage from '@/assets/peptides-hero-mobile.png'
  import peptidesHeroImage from '@/assets/peptides-hero.png'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()

  const heroImage = computed(() => (isMobile.value ? peptidesHeroMobileImage : peptidesHeroImage))
</script>

<style scoped lang="less">
  @font-display:
    'Instrument Sans',
    'SF Pro Display',
    -apple-system,
    sans-serif;
  @font-body:
    'Inter',
    'SF Pro Text',
    -apple-system,
    sans-serif;

  // ============================================
  // HERO - Structure à 3 niveaux
  // ============================================
  .hero {
    // Niveau 1 : Wrapper pleine largeur
    position: relative;
    width: 100%;
    min-height: 500px;
    overflow: hidden;
    background: var(--secondary-950);

    // Fond absolu (pleine largeur)
    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    &__bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(var(--secondary-950-rgb), 0.9) 0%,
        rgba(var(--secondary-950-rgb), 0.7) 25%,
        rgba(var(--secondary-950-rgb), 0.2) 50%,
        rgba(var(--secondary-950-rgb), 0.1) 70%,
        rgba(var(--secondary-950-rgb), 0.5) 95%,
        rgba(var(--secondary-950-rgb), 0.9) 100%
      );

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(var(--secondary-950-rgb), 0.6) 0%,
          transparent 15%,
          transparent 85%,
          rgba(var(--secondary-950-rgb), 0.6) 100%
        );
      }
    }

    &__bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 60% 60% at 30% 50%, black 0%, transparent 70%);
      pointer-events: none;
    }

    // Niveau 2 : Wrapper image (max-width 1200px, centré)
    &__image-wrapper {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      z-index: 1;
    }

    &__image {
      width: 100%;
      max-width: 1300px;
      height: 100%;
      object-fit: cover;
      object-position: center right;
    }

    // Niveau 3 : Wrapper flex pour les éléments
    &__content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      max-width: 1200px;
      min-height: 500px;
      margin: 0 auto;
      padding: 40px;
    }

    // Header : titre à gauche, badge en haut à droite
    &__header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;
    }

    // Éléments
    &__badge {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: rgba(var(--primary-700-rgb), 0.25);
      border: 1px solid rgba(var(--primary-500-rgb), 0.3);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 13px;
      color: var(--primary-300);
      backdrop-filter: blur(10px);

      &-dot {
        width: 8px;
        height: 8px;
        background: @success-500;
        border-radius: 50%;
      }

      &-sep {
        color: var(--text-muted);
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(36px, 4.5vw, 54px);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: @neutral-50; // Toujours clair (hero dark forcé)
      margin: 0;

      span {
        display: block;
      }

      &-accent {
        background: linear-gradient(
          135deg,
          var(--primary-400) 0%,
          var(--primary-300) 50%,
          var(--primary-500) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    &__footer {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 550px;
      margin-top: auto; // Pousse le footer en bas
    }

    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    &__trust {
      display: flex;
      gap: 24px;
      margin-top: 16px;
      padding-top: 24px;
      border-top: 1px solid var(--border-subtle);

      &-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: @font-body;
        font-size: 13px;
        color: var(--text-secondary);

        svg {
          width: 18px;
          height: 18px;
          color: var(--success-500);
        }
      }
    }

    // Mobile : bouton + badges sur une ligne
    &__bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      gap: 16px;
    }

    // Trust badges mobile (icônes seules)
    &__trust-mobile {
      display: flex;
      gap: 8px;

      &-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        background: rgba(var(--success-500-rgb), 0.15);
        border: 1px solid rgba(var(--success-500-rgb), 0.3);
        border-radius: 8px;

        svg {
          color: var(--success-400);
        }
      }
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================

  // TABLETTE (≤ 1160px)
  .respond-tablet({
    .hero {
      &__image {
        object-position: 70% center;
      }

      &__bg-overlay {
        background: linear-gradient(
          90deg,
          rgba(var(--secondary-950-rgb), 0.97) 0%,
          rgba(var(--secondary-950-rgb), 0.85) 30%,
          rgba(var(--secondary-950-rgb), 0.5) 60%,
          rgba(var(--secondary-950-rgb), 0.7) 100%
        );
      }

      &__content {
        padding: 24px 20px;
      }

      &__footer {
        max-width: 500px;
      }
    }
  });

  // MOBILE (≤ 720px)
  .respond-mobile({
    .hero {
      min-height: 480px;

      &__image {
        object-position: center center;
      }

      &__bg-overlay {
        background: linear-gradient(
          180deg,
          rgba(var(--secondary-950-rgb), 0.85) 0%,
          rgba(var(--secondary-950-rgb), 0.3) 25%,
          rgba(var(--secondary-950-rgb), 0.2) 50%,
          rgba(var(--secondary-950-rgb), 0.5) 75%,
          rgba(var(--secondary-950-rgb), 0.95) 100%
        );

        &::after {
          display: none;
        }
      }

      &__content {
        min-height: 480px;
        padding: 20px;
      }

      &__footer {
        gap: 12px;
      }

      &__title {
        font-size: 28px;
        text-shadow: 0 2px 20px rgba(var(--secondary-950-rgb), 0.5);
      }

      &__badge {
        padding: 6px 12px;
        font-size: 11px;
        background: rgba(var(--secondary-950-rgb), 0.5);
      }
    }
  });
</style>
