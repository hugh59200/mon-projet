<template>
  <section class="hero-section">
    <!-- Image de fond (pleine largeur) -->
    <div class="hero-section__bg">
      <div class="hero-section__bg-image">
        <img
          :src="peptidesHeroImage"
          alt="Fioles de peptides Fast Peptides"
        />
        <div class="hero-section__bg-overlay"></div>
      </div>

      <!-- Grille décorative -->
      <div class="hero-section__grid"></div>
    </div>

    <!-- Conteneur centré max-width 1200px -->
    <div class="hero-section__container">
      <!-- Badge mobile en haut à droite -->
      <div v-if="isMobile" class="hero__badge hero__badge--mobile">
        <span class="hero__badge-dot"></span>
        <span>{{ t('home.hero.badge.certified') }}</span>
      </div>

      <!-- Titre mobile en haut -->
      <h1 v-if="isMobile" class="hero__title hero__title--mobile">
        <span>{{ t('home.hero.title.line1') }}</span>
        <span class="hero__title-accent">{{ t('home.hero.title.accent') }}</span>
        <span>{{ t('home.hero.title.line2') }}</span>
      </h1>

      <!-- Contenu -->
      <div class="hero-section__content">
      <div v-if="!isMobile" class="hero__badge">
        <span class="hero__badge-dot"></span>
        <span>{{ t('home.hero.badge.certified') }}</span>
        <span class="hero__badge-sep">•</span>
        <span>{{ t('home.hero.badge.researchOnly') }}</span>
      </div>

      <h1 v-if="!isMobile" class="hero__title">
        <span>{{ t('home.hero.title.line1') }}</span>
        <span class="hero__title-accent">{{ t('home.hero.title.accent') }}</span>
        <span>{{ t('home.hero.title.line2') }}</span>
      </h1>

      <p class="hero__desc">
        {{ t('home.hero.description') }}
      </p>

      <div class="hero__actions">
        <BaseButton
          variant="primary"
          arrow
          @click="$router.push('/catalogue')"
        >
          {{ t('home.hero.cta.explore') }}
        </BaseButton>
        <BaseButton
          variant="ghost"
          @click="$router.push('/a-propos')"
        >
          {{ t('home.hero.cta.learnMore') }}
        </BaseButton>
      </div>

      <div v-if="!isMobile" class="hero__trust">
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
  import peptidesHeroImage from '@/assets/peptides-hero.png'
  import { useDeviceBreakpoint } from '@/plugin/device-breakpoint/DeviceBreakpoint.types'
  import { useI18n } from 'vue-i18n'
  import BaseButton from './shared/BaseButton.vue'

  const { t } = useI18n()
  const { isMobile } = useDeviceBreakpoint()
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
  // SECTION (layout géré par ContentBlock parent)
  // ============================================
  .hero-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    min-height: 500px;

    // Fond (pleine largeur)
    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
    }

    // Image de fond
    &__bg-image {
      position: absolute;
      inset: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center right;
      }
    }

    // Overlay - DESKTOP (le plus clair)
    &__bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(2, 2, 2, 0.9) 0%,
        rgba(2, 2, 2, 0.7) 25%,
        rgba(2, 2, 2, 0.2) 50%,
        rgba(2, 2, 2, 0.1) 70%,
        rgba(2, 2, 2, 0.5) 95%,
        rgba(2, 2, 2, 0.9) 100%
      );

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(2, 2, 2, 0.6) 0%,
          transparent 15%,
          transparent 85%,
          rgba(2, 2, 2, 0.6) 100%
        );
      }
    }

    // Grille décorative
    &__grid {
      position: absolute;
      inset: 0;
      z-index: 1;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.04) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse 60% 60% at 30% 50%, black 0%, transparent 70%);
      pointer-events: none;
    }

    // Conteneur centré
    &__container {
      position: relative;
      z-index: 2;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    // Contenu
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 550px;
      padding: 60px 0;
    }
  }

  // ============================================
  // HERO ELEMENTS
  // ============================================
  .hero {
    &__badge {
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
      width: fit-content;
      backdrop-filter: blur(10px);

      &-dot {
        width: 8px;
        height: 8px;
        background: @success-500;
        border-radius: 50%;
      }

      &-sep {
        color: @neutral-500;
      }

      &--mobile {
        position: absolute;
        top: 16px;
        right: 20px;
        z-index: 10;
        padding: 6px 12px;
        font-size: 11px;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(12px);
      }
    }

    &__title--mobile {
      position: absolute;
      top: 25%;
      left: 20px;
      right: 20px;
      transform: translateY(-50%);
      font-family: @font-display;
      font-size: 28px;
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: @neutral-50;
      margin: 0;
      text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);

      span {
        display: block;
      }

      .hero__title-accent {
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

    &__title {
      font-family: @font-display;
      font-size: clamp(36px, 4.5vw, 54px);
      font-weight: 600;
      line-height: 1.1;
      letter-spacing: -0.03em;
      color: @neutral-50;
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

    &__desc {
      font-family: @font-body;
      font-size: 16px;
      line-height: 1.7;
      color: @neutral-300;
      margin: 0;
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
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      &-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: @font-body;
        font-size: 13px;
        color: @neutral-400;

        svg {
          width: 18px;
          height: 18px;
          color: @success-500;
        }
      }
    }
  }

  // ============================================
  // RESPONSIVE - Breakpoints harmonisés
  // ============================================

  // TABLETTE (≤ 1160px)
  .respond-tablet({
    .hero-section {
      &__bg-image img {
        object-position: 70% center;
        mask-image: none;
        -webkit-mask-image: none;
      }

      &__bg-overlay {
        background: linear-gradient(
          90deg,
          rgba(2, 2, 2, 0.97) 0%,
          rgba(2, 2, 2, 0.85) 30%,
          rgba(2, 2, 2, 0.5) 60%,
          rgba(2, 2, 2, 0.7) 100%
        );
      }

      &__container {
        padding: 0 20px;
      }

      &__content {
        max-width: 500px;
        padding: 40px 0;
      }
    }
  });

  // MOBILE (≤ 720px)
  .respond-mobile({
    .hero-section {
      min-height: 480px;
      align-items: stretch;

      &__bg-image img {
        object-position: center center;
      }

      // Overlay léger pour voir l'image
      &__bg-overlay {
        background: linear-gradient(
          180deg,
          rgba(2, 2, 2, 0.85) 0%,
          rgba(2, 2, 2, 0.3) 25%,
          rgba(2, 2, 2, 0.2) 50%,
          rgba(2, 2, 2, 0.5) 75%,
          rgba(2, 2, 2, 0.95) 100%
        );

        &::after {
          display: none;
        }
      }

      &__container {
        padding: 0 20px;
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
      }

      &__content {
        padding: 0 0 32px;
        text-align: left;
        align-items: flex-start;
        gap: 12px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
      }
    }

    .hero {
      &__title {
        font-size: 28px;
        text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
      }

      &__desc {
        font-size: 14px;
        line-height: 1.6;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      &__actions {
        margin-top: 4px;

        :deep(button:nth-child(2)) {
          display: none;
        }
      }
    }
  });
</style>
