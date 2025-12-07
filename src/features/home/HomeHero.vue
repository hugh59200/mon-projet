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
      <!-- Contenu -->
      <div class="hero-section__content">
      <div class="hero__badge">
        <span class="hero__badge-dot"></span>
        <span>{{ t('home.hero.badge.certified') }}</span>
        <span class="hero__badge-sep">•</span>
        <span>{{ t('home.hero.badge.researchOnly') }}</span>
      </div>

      <h1 class="hero__title">
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

      <div class="hero__trust">
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
  import { useI18n } from 'vue-i18n'
  import BaseButton from './shared/BaseButton.vue'

  const { t } = useI18n()
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
      width: 100%;
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
      &__bg-image img {
        object-position: center center;
      }

      &__bg-overlay {
        background: rgba(2, 2, 2, 0.85);

        &::after {
          background: linear-gradient(
            180deg,
            rgba(2, 2, 2, 0.2) 0%,
            transparent 20%,
            transparent 80%,
            rgba(2, 2, 2, 0.2) 100%
          );
        }
      }

      &__container {
        padding: 0 16px;
      }

      &__content {
        max-width: 100%;
        padding: 32px 0;
        text-align: center;
        align-items: center;
        gap: 20px;
      }
    }

    .hero {
      &__badge {
        &-sep,
        & > span:last-of-type {
          display: none;
        }
      }

      &__title {
        font-size: 32px;
      }

      &__desc {
        font-size: 14px;
      }

      &__actions {
        width: 100%;

        :deep(button) {
          width: 100%;
          justify-content: center;
        }

        // Masquer le CTA secondaire sur mobile pour simplifier
        :deep(button:nth-child(2)) {
          display: none;
        }
      }

      &__trust {
        flex-direction: column;
        gap: 10px;
        align-items: center;

        &-item {
          font-size: 12px;
        }
      }
    }
  });
</style>
