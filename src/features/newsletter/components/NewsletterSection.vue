<template>
  <section class="newsletter-section">
    <!-- Background effects -->
    <div class="newsletter-section__bg">
      <div class="newsletter-section__gradient"></div>
      <div class="newsletter-section__grid"></div>
      <div class="newsletter-section__glow"></div>
    </div>

    <div class="newsletter-section__container">
      <!-- Left: Content -->
      <div class="newsletter-section__content">
        <div class="newsletter-section__badge">
          <BasicIconNext
            name="Sparkles"
            :size="14"
          />
          <span>{{ t('newsletter.badge') }}</span>
        </div>

        <h2 class="newsletter-section__title">
          <span class="newsletter-section__title-line">{{ t('newsletter.title') }}</span>
        </h2>

        <p class="newsletter-section__description">
          {{ t('newsletter.description') }}
        </p>

        <!-- Features list -->
        <ul class="newsletter-section__features">
          <li
            v-for="(feature, index) in features"
            :key="index"
          >
            <div class="newsletter-section__feature-icon">
              <BasicIconNext
                :name="feature.icon"
                :size="18"
              />
            </div>
            <div>
              <span class="newsletter-section__feature-title">{{ feature.title }}</span>
              <span class="newsletter-section__feature-desc">{{ feature.description }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- Right: Signup Form -->
      <div class="newsletter-section__form-wrapper">
        <NewsletterSignup
          variant="premium"
          source="website"
          :show-features="false"
          :show-name-field="true"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useLanguage } from '@/composables/useLanguage'
  import NewsletterSignup from './NewsletterSignup.vue'
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.types'

  const { t } = useLanguage()

  interface Feature {
    icon: IconNameNext
    title: string
    description: string
  }

  const features = computed<Feature[]>(() => [
    {
      icon: 'Gift',
      title: t('newsletter.features.exclusive'),
      description: '',
    },
    {
      icon: 'FlaskConical',
      title: t('newsletter.features.research'),
      description: '',
    },
    {
      icon: 'Percent',
      title: t('newsletter.features.promotions'),
      description: '',
    },
    {
      icon: 'Shield',
      title: t('newsletter.features.unsubscribe'),
      description: '',
    },
  ])
</script>

<style scoped lang="less">
  @ease: cubic-bezier(0.4, 0, 0.2, 1);

  .newsletter-section {
    position: relative;
    max-width: 1200px;
    margin: 60px auto;
    padding: 0 40px;

    // ============================================
    // BACKGROUND (now contained)
    // ============================================

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      border-radius: 24px;
      overflow: hidden;
    }

    &__gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(26, 26, 46, 0.95) 0%,
        rgba(15, 15, 25, 0.98) 100%
      );
    }

    &__grid {
      position: absolute;
      inset: 0;
      background-image: linear-gradient(
          rgba(var(--primary-500-rgb), 0.03) 1px,
          transparent 1px
        ),
        linear-gradient(90deg, rgba(var(--primary-500-rgb), 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      mask-image: radial-gradient(ellipse at center, black 0%, transparent 70%);
    }

    &__glow {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 600px;
      height: 300px;
      background: radial-gradient(
        ellipse at center,
        rgba(var(--primary-500-rgb), 0.12) 0%,
        transparent 60%
      );
      pointer-events: none;
    }

    // ============================================
    // CONTAINER
    // ============================================

    &__container {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      padding: 60px 50px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
    }

    // ============================================
    // CONTENT (Left)
    // ============================================

    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: linear-gradient(
        135deg,
        rgba(var(--primary-500-rgb), 0.15) 0%,
        rgba(var(--primary-600-rgb), 0.05) 100%
      );
      border: 1px solid rgba(var(--primary-400-rgb), 0.25);
      border-radius: 100px;
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-300);
      text-transform: uppercase;
      letter-spacing: 0.8px;
      width: fit-content;

      svg {
        color: var(--primary-400);
      }
    }

    &__title {
      font-size: 44px;
      font-weight: 700;
      line-height: 1.15;
      margin: 0;
    }

    &__title-line {
      background: linear-gradient(135deg, @white 0%, rgba(255, 255, 255, 0.85) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    &__description {
      font-size: 17px;
      line-height: 1.7;
      color: rgba(255, 255, 255, 0.55);
      max-width: 480px;
      margin: 0;
    }

    // ============================================
    // FEATURES
    // ============================================

    &__features {
      display: flex;
      flex-direction: column;
      gap: 16px;
      list-style: none;
      padding: 0;
      margin: 16px 0 0;

      li {
        display: flex;
        align-items: center;
        gap: 16px;
      }
    }

    &__feature-icon {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      flex-shrink: 0;

      svg {
        color: var(--primary-400);
      }
    }

    &__feature-title {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
    }

    &__feature-desc {
      display: block;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.45);
      margin-top: 2px;
    }

    // ============================================
    // FORM WRAPPER (Right)
    // ============================================

    &__form-wrapper {
      display: flex;
      justify-content: flex-end;
    }

    // ============================================
    // RESPONSIVE
    // ============================================

    .respond-tablet({
      margin: 40px auto;
      padding: 0 24px;

      &__container {
        grid-template-columns: 1fr;
        gap: 40px;
        padding: 40px 32px;
      }

      &__content {
        text-align: center;
        align-items: center;
      }

      &__title {
        font-size: 32px;
      }

      &__description {
        max-width: 100%;
      }

      &__features {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;

        li {
          flex-direction: column;
          text-align: center;
          gap: 12px;
        }
      }

      &__form-wrapper {
        justify-content: center;
      }
    });

    .respond-mobile({
      margin: 32px auto;
      padding: 0 16px;

      &__bg {
        border-radius: 16px;
      }

      &__container {
        padding: 32px 20px;
        gap: 28px;
        border-radius: 16px;
      }

      &__title {
        font-size: 26px;
      }

      &__description {
        font-size: 15px;
      }

      &__features {
        grid-template-columns: 1fr;
      }
    });
  }

  // ============================================
  // ANIMATIONS
  // ============================================

  @keyframes pulse {
    0%,
    100% {
      opacity: 0.5;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.1);
    }
  }
</style>
