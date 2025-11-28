<template>
  <section class="hero-wrapper">
    <div class="hero-section">
      <!-- Image de fond -->
      <div class="hero-section__bg-image">
        <img
          :src="peptidesHeroImage"
          alt="Fioles de peptides Fast Peptides"
        />
        <div class="hero-section__bg-overlay"></div>
      </div>

      <!-- Grille décorative -->
      <div class="hero-section__grid"></div>

      <!-- Contenu -->
      <div class="hero-section__content">
        <div class="hero__badge">
          <span class="hero__badge-dot"></span>
          <span>Fournisseur européen certifié</span>
          <span class="hero__badge-sep">•</span>
          <span>Usage recherche exclusif</span>
        </div>

        <h1 class="hero__title">
          <span>Peptides de recherche</span>
          <span class="hero__title-accent">haute pureté</span>
          <span>pour laboratoires</span>
        </h1>

        <p class="hero__desc">
          Catalogue sélectionné de peptides certifiés ≥99% de pureté. Certificats d'analyse
          disponibles. Expédition 24h depuis l'Union Européenne.
        </p>

        <div class="hero__actions">
          <BaseButton
            variant="primary"
            arrow
            @click="$router.push('/catalogue')"
          >
            Explorer le catalogue
          </BaseButton>
          <BaseButton
            variant="ghost"
            @click="$router.push('/a-propos')"
          >
            En savoir plus
          </BaseButton>
        </div>

        <div class="hero__trust">
          <div class="hero__trust-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span>Pureté ≥99%</span>
          </div>
          <div class="hero__trust-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>COA inclus</span>
          </div>
          <div class="hero__trust-item">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            >
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Livraison 24h</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import peptidesHeroImage from '@/assets/peptides-hero-2.png'
  import BaseButton from './shared/BaseButton.vue'
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
  // WRAPPER (pleine largeur)
  // ============================================
  .hero-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 24px;
    background: var(--secondary-950);
  }

  // ============================================
  // SECTION (max 1200px, contient tout)
  // ============================================
  .hero-section {
    position: relative;
    width: 100%;
    max-width: 1200px;
    min-height: 500px;
    display: flex;
    align-items: center;
    border-radius: 24px;
    overflow: hidden;

    // Image de fond
    &__bg-image {
      position: absolute;
      inset: 0;
      z-index: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center right;
      }
    }

    &__bg-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        rgba(var(--secondary-950-rgb), 0.97) 0%,
        rgba(var(--secondary-950-rgb), 0.9) 35%,
        rgba(var(--secondary-950-rgb), 0.5) 65%,
        rgba(var(--secondary-950-rgb), 0.2) 100%
      );

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          180deg,
          rgba(var(--secondary-950-rgb), 0.3) 0%,
          transparent 15%,
          transparent 85%,
          rgba(var(--secondary-950-rgb), 0.4) 100%
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

    // Contenu
    &__content {
      position: relative;
      z-index: 2;
      display: flex;
      flex-direction: column;
      gap: 24px;
      max-width: 550px;
      padding: 60px;
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
  // RESPONSIVE
  // ============================================
  @media (max-width: 1100px) {
    .hero-section {
      &__bg-overlay {
        background: linear-gradient(
          90deg,
          rgba(var(--secondary-950-rgb), 0.97) 0%,
          rgba(var(--secondary-950-rgb), 0.92) 50%,
          rgba(var(--secondary-950-rgb), 0.7) 100%
        );
      }

      &__content {
        max-width: 500px;
        padding: 50px;
      }
    }
  }

  @media (max-width: 768px) {
    .hero-wrapper {
      padding: 0 16px;
    }

    .hero-section {
      min-height: auto;
      border-radius: 20px;

      &__bg-overlay {
        background: rgba(var(--secondary-950-rgb), 0.88);
      }

      &__content {
        max-width: 100%;
        padding: 40px 24px;
        text-align: center;
        align-items: center;
      }
    }

    .hero {
      &__actions {
        flex-direction: column;
        width: 100%;

        :deep(button) {
          width: 100%;
          justify-content: center;
        }
      }

      &__trust {
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }
    }
  }
</style>
