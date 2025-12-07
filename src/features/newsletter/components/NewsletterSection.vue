<template>
  <section class="newsletter-section">
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
  .newsletter-section {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

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
      background: var(--content-block-bg-subtle);
      border: 1px solid var(--content-block-border);
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
      color: var(--content-block-text);
    }

    &__description {
      font-size: 17px;
      line-height: 1.7;
      color: var(--content-block-text-secondary);
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
      background: var(--content-block-bg-subtle);
      border: 1px solid var(--content-block-border);
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
      color: var(--content-block-text);
    }

    &__feature-desc {
      display: block;
      font-size: 13px;
      color: var(--content-block-text-muted);
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
      grid-template-columns: 1fr;
      gap: 40px;

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
      gap: 28px;

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
</style>
