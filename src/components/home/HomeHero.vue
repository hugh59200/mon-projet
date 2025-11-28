<template>
  <section class="layout-section layout-section--hero">
    <div class="layout-section__bg">
      <div class="layout-section__grid"></div>
      <div class="layout-section__glow layout-section__glow--1"></div>
      <div class="layout-section__glow layout-section__glow--2"></div>
      <div class="layout-section__particles">
        <span
          v-for="n in 20"
          :key="n"
        ></span>
      </div>
    </div>

    <div class="layout-section__inner layout-section__inner--two-cols">
      <div class="hero__content">
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

      <!-- NOUVELLE SECTION : Image des peptides -->
      <div class="hero__visual">
        <div class="hero__image-wrapper">
          <!-- Glow effect derrière l'image -->
          <div class="hero__image-glow"></div>

          <!-- Image principale -->
          <img
            :src="peptidesHeroImage"
            alt="Fioles de peptides Fast Peptides - BPC-157, TB-500, CJC-1295, PT-141"
            class="hero__image"
          />

          <!-- Overlay gradient pour fusion avec le fond -->
          <div class="hero__image-overlay"></div>

          <!-- Badges flottants animés -->
          <div class="hero__floating-badge hero__floating-badge--1">
            <span class="hero__floating-badge-icon">⚗️</span>
            <span>Pureté 99%+</span>
          </div>
          <div class="hero__floating-badge hero__floating-badge--2">
            <span class="hero__floating-badge-icon">🇪🇺</span>
            <span>Made in EU</span>
          </div>
          <div class="hero__floating-badge hero__floating-badge--3">
            <span class="hero__floating-badge-icon">📋</span>
            <span>COA fourni</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import BaseButton from './shared/BaseButton.vue'

  // Import de l'image locale
  import peptidesHeroImage from '@/assets/peptides-hero.png'
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
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .layout-section {
    position: relative;
    width: 100%;
    padding: 80px 32px;
    background: linear-gradient(
      180deg,
      var(--secondary-950) 0%,
      var(--secondary-900) 50%,
      var(--secondary-950) 100%
    );
    overflow: hidden;

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    &__grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 80px 80px;
      mask-image: radial-gradient(ellipse 70% 50% at 50% 50%, black 0%, transparent 70%);
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(120px);
      opacity: 0.3;
      &--1 {
        top: 10%;
        left: 20%;
        width: 600px;
        height: 600px;
        background: radial-gradient(circle, var(--primary-600) 0%, transparent 70%);
        animation: float 20s ease-in-out infinite;
      }
      &--2 {
        bottom: 10%;
        right: 10%;
        width: 500px;
        height: 500px;
        background: radial-gradient(circle, var(--primary-400) 0%, transparent 70%);
        animation: float 25s ease-in-out infinite reverse;
      }
    }

    &__particles {
      position: absolute;
      inset: 0;
      overflow: hidden;
      span {
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(var(--primary-400-rgb), 0.4);
        border-radius: 50%;
        animation: particleFloat 15s infinite ease-in-out;
        &:nth-child(1) {
          left: 5%;
          animation-delay: 0.5s;
        }
        &:nth-child(2) {
          left: 10%;
          animation-delay: 1s;
        }
        &:nth-child(3) {
          left: 15%;
          animation-delay: 1.5s;
        }
        &:nth-child(4) {
          left: 20%;
          animation-delay: 2s;
        }
        &:nth-child(5) {
          left: 25%;
          animation-delay: 2.5s;
        }
        &:nth-child(6) {
          left: 30%;
          animation-delay: 3s;
        }
        &:nth-child(7) {
          left: 35%;
          animation-delay: 3.5s;
        }
        &:nth-child(8) {
          left: 40%;
          animation-delay: 4s;
        }
        &:nth-child(9) {
          left: 45%;
          animation-delay: 4.5s;
        }
        &:nth-child(10) {
          left: 50%;
          animation-delay: 5s;
        }
        &:nth-child(11) {
          left: 55%;
          animation-delay: 5.5s;
        }
        &:nth-child(12) {
          left: 60%;
          animation-delay: 6s;
        }
        &:nth-child(13) {
          left: 65%;
          animation-delay: 6.5s;
        }
        &:nth-child(14) {
          left: 70%;
          animation-delay: 7s;
        }
        &:nth-child(15) {
          left: 75%;
          animation-delay: 7.5s;
        }
        &:nth-child(16) {
          left: 80%;
          animation-delay: 8s;
        }
        &:nth-child(17) {
          left: 85%;
          animation-delay: 8.5s;
        }
        &:nth-child(18) {
          left: 90%;
          animation-delay: 9s;
        }
        &:nth-child(19) {
          left: 95%;
          animation-delay: 9.5s;
        }
        &:nth-child(20) {
          left: 100%;
          animation-delay: 10s;
        }
      }
    }

    &__inner {
      position: relative;
      z-index: 1;
      max-width: 1200px;
      margin: 0 auto;
      &--two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
      }
    }
  }

  @keyframes float {
    0%,
    100% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(30px, -30px);
    }
  }

  @keyframes particleFloat {
    0%,
    100% {
      transform: translateY(100vh) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 0.6;
      transform: scale(1);
    }
    90% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-10vh) scale(0);
      opacity: 0;
    }
  }

  .hero {
    &__content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: rgba(var(--primary-700-rgb), 0.15);
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
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
        animation: pulse 2s infinite;
      }
      &-sep {
        color: @neutral-500;
      }
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.5;
        transform: scale(1.2);
      }
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(42px, 5vw, 64px);
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
      }
    }

    &__desc {
      font-family: @font-body;
      font-size: 18px;
      line-height: 1.7;
      color: @neutral-300;
      max-width: 520px;
      margin: 0;
    }

    &__actions {
      display: flex;
      gap: 16px;
      margin-top: 8px;
    }

    &__trust {
      display: flex;
      gap: 32px;
      margin-top: 16px;
      padding-top: 24px;
      border-top: 1px solid rgba(var(--neutral-300-rgb), 0.1);
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

    // ============================================
    // NOUVELLE SECTION : Visual avec image
    // ============================================
    &__visual {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    &__image-wrapper {
      position: relative;
      width: 100%;
      max-width: 520px;
    }

    &__image-glow {
      position: absolute;
      inset: -20%;
      background: radial-gradient(
        ellipse 60% 50% at 50% 60%,
        rgba(var(--primary-500-rgb), 0.2) 0%,
        rgba(var(--primary-600-rgb), 0.1) 40%,
        transparent 70%
      );
      filter: blur(40px);
      z-index: 0;
      animation: glowPulse 4s ease-in-out infinite;
    }

    @keyframes glowPulse {
      0%,
      100% {
        opacity: 0.6;
        transform: scale(1);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.05);
      }
    }

    &__image {
      position: relative;
      z-index: 1;
      width: 100%;
      height: auto;
      border-radius: 16px;
      // Masque pour fusionner avec le fond sombre
      mask-image: linear-gradient(to bottom, transparent 0%, black 5%, black 85%, transparent 100%);
      -webkit-mask-image: linear-gradient(
        to bottom,
        transparent 0%,
        black 5%,
        black 85%,
        transparent 100%
      );
      // Légère ombre pour la profondeur
      filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.4));
      // Animation d'entrée
      animation: imageReveal 1s ease-out 0.3s both;
    }

    @keyframes imageReveal {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    &__image-overlay {
      position: absolute;
      inset: 0;
      z-index: 2;
      border-radius: 16px;
      pointer-events: none;
      // Gradient subtil pour harmoniser avec le fond
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.05) 0%,
        transparent 50%,
        rgba(var(--secondary-950-rgb), 0.1) 100%
      );
    }

    // Badges flottants animés
    &__floating-badge {
      position: absolute;
      z-index: 3;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: rgba(var(--secondary-800-rgb), 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(var(--primary-500-rgb), 0.2);
      border-radius: 12px;
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @neutral-100;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      white-space: nowrap;

      &-icon {
        font-size: 16px;
      }

      &--1 {
        top: 5%;
        right: -5%;
        animation: floatBadge 6s ease-in-out infinite;
      }

      &--2 {
        bottom: 30%;
        left: -8%;
        animation: floatBadge 7s ease-in-out infinite 1s;
      }

      &--3 {
        bottom: 10%;
        right: 5%;
        animation: floatBadge 8s ease-in-out infinite 2s;
      }
    }

    @keyframes floatBadge {
      0%,
      100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
  }

  // ============================================
  // RESPONSIVE
  // ============================================
  @media (max-width: 1100px) {
    .layout-section__inner--two-cols {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .hero__content {
      text-align: center;
      align-items: center;
    }
    .hero__desc {
      max-width: 600px;
    }
    .hero__trust {
      justify-content: center;
    }
    .hero__visual {
      order: 1;
    }
    .hero__image-wrapper {
      max-width: 450px;
    }
    .hero__floating-badge {
      &--1 {
        right: 0;
      }
      &--2 {
        left: 0;
      }
      &--3 {
        right: 10%;
      }
    }
  }

  @media (max-width: 768px) {
    .layout-section {
      padding: 60px 20px;
    }
    .hero {
      &__actions {
        flex-direction: column;
        width: 100%;
      }
      &__trust {
        flex-direction: column;
        gap: 12px;
      }
      &__visual {
        display: none;
      }
    }
  }
</style>
