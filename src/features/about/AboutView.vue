<template>
  <div class="about-page">
    <!-- ============================================ -->
    <!-- HERO SECTION -->
    <!-- ============================================ -->
    <section class="about-hero">
      <div class="about-hero__bg">
        <div class="about-hero__gradient"></div>
        <div class="about-hero__pattern"></div>
        <div class="about-hero__glow about-hero__glow--1"></div>
        <div class="about-hero__glow about-hero__glow--2"></div>
      </div>

      <div class="about-hero__content">
        <span class="about-hero__badge">
          <BasicIconNext name="Building2" :size="14" />
          {{ t('about.hero.badge') }}
        </span>
        <h1 class="about-hero__title">
          {{ t('about.hero.title.line1') }}
          <span class="about-hero__title--accent">{{ t('about.hero.title.accent') }}</span>
        </h1>
        <p class="about-hero__subtitle">
          {{ t('about.hero.subtitle') }}
        </p>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- DOUBLE DNA SECTION (US + FR) -->
    <!-- ============================================ -->
    <section class="about-dna">
      <div class="about-dna__container">
        <div class="about-dna__intro">
          <h2 class="about-dna__title">{{ t('about.dna.title') }}</h2>
          <p class="about-dna__desc">{{ t('about.dna.description') }}</p>
        </div>

        <div class="about-dna__grid">
          <!-- Expertise US -->
          <div class="dna-card dna-card--us">
            <div class="dna-card__icon">
              <BasicIconNext name="Brain" :size="28" />
            </div>
            <div class="dna-card__flag">
              <span>🇺🇸</span>
            </div>
            <h3 class="dna-card__title">{{ t('about.dna.us.title') }}</h3>
            <p class="dna-card__text">{{ t('about.dna.us.text') }}</p>
            <ul class="dna-card__list">
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.us.point1') }}
              </li>
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.us.point2') }}
              </li>
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.us.point3') }}
              </li>
            </ul>
          </div>

          <!-- Proximité FR -->
          <div class="dna-card dna-card--fr">
            <div class="dna-card__icon">
              <BasicIconNext name="Truck" :size="28" />
            </div>
            <div class="dna-card__flag">
              <span>🇫🇷</span>
            </div>
            <h3 class="dna-card__title">{{ t('about.dna.fr.title') }}</h3>
            <p class="dna-card__text">{{ t('about.dna.fr.text') }}</p>
            <ul class="dna-card__list">
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.fr.point1') }}
              </li>
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.fr.point2') }}
              </li>
              <li>
                <BasicIconNext name="CheckCircle2" :size="16" />
                {{ t('about.dna.fr.point3') }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- ADVANTAGES SECTION -->
    <!-- ============================================ -->
    <section class="about-advantages">
      <div class="about-advantages__container">
        <div class="about-advantages__header">
          <span class="about-advantages__badge">
            <BasicIconNext name="Star" :size="14" />
            {{ t('about.advantages.badge') }}
          </span>
          <h2 class="about-advantages__title">{{ t('about.advantages.title') }}</h2>
        </div>

        <div class="about-advantages__grid">
          <div
            v-for="(adv, index) in advantages"
            :key="index"
            class="advantage-card"
          >
            <div class="advantage-card__icon" :class="`advantage-card__icon--${adv.color}`">
              <BasicIconNext :name="adv.icon" :size="24" />
            </div>
            <h3 class="advantage-card__title">{{ adv.title }}</h3>
            <p class="advantage-card__text">{{ adv.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- QUALITY SECTION -->
    <!-- ============================================ -->
    <section class="about-quality">
      <div class="about-quality__container">
        <div class="about-quality__content">
          <span class="about-quality__badge">
            <BasicIconNext name="Shield" :size="14" />
            {{ t('about.quality.badge') }}
          </span>
          <h2 class="about-quality__title">{{ t('about.quality.title') }}</h2>
          <p class="about-quality__desc">{{ t('about.quality.description') }}</p>

          <div class="about-quality__points">
            <div
              v-for="(point, index) in qualityPoints"
              :key="index"
              class="quality-point"
            >
              <div class="quality-point__number">{{ index + 1 }}</div>
              <div class="quality-point__content">
                <h4>{{ point.title }}</h4>
                <p>{{ point.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about-quality__visual">
          <div class="quality-badge-card">
            <div class="quality-badge-card__icon">
              <BasicIconNext name="Award" :size="48" />
            </div>
            <div class="quality-badge-card__content">
              <span class="quality-badge-card__label">{{ t('about.quality.badge_card.label') }}</span>
              <span class="quality-badge-card__value">≥99%</span>
              <span class="quality-badge-card__sublabel">{{ t('about.quality.badge_card.sublabel') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- DISCLAIMER SECTION -->
    <!-- ============================================ -->
    <section class="about-disclaimer">
      <div class="about-disclaimer__container">
        <div class="about-disclaimer__icon">
          <BasicIconNext name="AlertTriangle" :size="32" />
        </div>
        <div class="about-disclaimer__content">
          <h3 class="about-disclaimer__title">{{ t('about.disclaimer.title') }}</h3>
          <p class="about-disclaimer__text">{{ t('about.disclaimer.text') }}</p>
        </div>
      </div>
    </section>

    <!-- ============================================ -->
    <!-- CTA SECTION -->
    <!-- ============================================ -->
    <section class="about-cta">
      <div class="about-cta__container">
        <h2 class="about-cta__title">{{ t('about.cta.title') }}</h2>
        <p class="about-cta__text">{{ t('about.cta.text') }}</p>
        <div class="about-cta__buttons">
          <PremiumButton
            type="primary"
            variant="solid"
            size="lg"
            :label="t('about.cta.catalogue')"
            icon-right="ArrowRight"
            :shine="true"
            :glow="true"
            @click="$router.push('/catalogue')"
          />
          <PremiumButton
            type="white"
            variant="outline"
            size="lg"
            :label="t('about.cta.contact')"
            icon-left="MessageCircle"
            @click="$router.push('/contact')"
          />
        </div>
        <p class="about-cta__signature">{{ t('about.cta.signature') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.vue'

const { t } = useI18n()

type Advantage = {
  icon: IconNameNext
  color: 'primary' | 'success' | 'warning' | 'info'
  title: string
  text: string
}

const advantages = computed<Advantage[]>(() => [
  {
    icon: 'PackageX',
    color: 'success',
    title: t('about.advantages.items.noDuty.title'),
    text: t('about.advantages.items.noDuty.text'),
  },
  {
    icon: 'Zap',
    color: 'warning',
    title: t('about.advantages.items.fast.title'),
    text: t('about.advantages.items.fast.text'),
  },
  {
    icon: 'MapPin',
    color: 'info',
    title: t('about.advantages.items.tracking.title'),
    text: t('about.advantages.items.tracking.text'),
  },
  {
    icon: 'ShieldCheck',
    color: 'primary',
    title: t('about.advantages.items.quality.title'),
    text: t('about.advantages.items.quality.text'),
  },
])

const qualityPoints = computed(() => [
  {
    title: t('about.quality.points.storage.title'),
    text: t('about.quality.points.storage.text'),
  },
  {
    title: t('about.quality.points.testing.title'),
    text: t('about.quality.points.testing.text'),
  },
  {
    title: t('about.quality.points.packaging.title'),
    text: t('about.quality.points.packaging.text'),
  },
])
</script>

<style scoped lang="less">
@font-display: 'Instrument Sans', 'SF Pro Display', -apple-system, sans-serif;
@font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;
@ease: cubic-bezier(0.4, 0, 0.2, 1);

.about-page {
  min-height: 100vh;
  background: @neutral-50;
}

// ============================================
// HERO SECTION
// ============================================
.about-hero {
  position: relative;
  padding: 120px 24px 80px;
  overflow: hidden;
  background: linear-gradient(180deg, @neutral-900 0%, @neutral-800 100%);

  &__bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 20%, rgba(var(--primary-500-rgb), 0.15) 0%, transparent 50%);
  }

  &__pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  &__glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;

    &--1 {
      top: -100px;
      right: 10%;
      width: 400px;
      height: 400px;
      background: var(--primary-500);
    }

    &--2 {
      bottom: -50px;
      left: 20%;
      width: 300px;
      height: 300px;
      background: var(--primary-400);
    }
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(var(--primary-500-rgb), 0.15);
    border: 1px solid rgba(var(--primary-400-rgb), 0.3);
    border-radius: 100px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-300);
    margin-bottom: 24px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__title {
    font-family: @font-display;
    font-size: clamp(36px, 6vw, 56px);
    font-weight: 700;
    color: @white;
    line-height: 1.1;
    margin: 0 0 24px;

    &--accent {
      display: block;
      background: linear-gradient(135deg, var(--primary-400) 0%, var(--primary-300) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-family: @font-body;
    font-size: 18px;
    color: @neutral-300;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto;
  }
}

// ============================================
// DNA SECTION (Double Identity)
// ============================================
.about-dna {
  padding: 100px 24px;
  background: @white;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__intro {
    text-align: center;
    max-width: 700px;
    margin: 0 auto 60px;
  }

  &__title {
    font-family: @font-display;
    font-size: 36px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 16px;
  }

  &__desc {
    font-family: @font-body;
    font-size: 18px;
    color: @neutral-600;
    line-height: 1.6;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}

.dna-card {
  position: relative;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid @neutral-200;
  background: @white;
  transition: all 0.3s @ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
  }

  &--us {
    border-top: 4px solid #3b82f6;
  }

  &--fr {
    border-top: 4px solid #ef4444;
  }

  &__icon {
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
    border-radius: 16px;
    color: var(--primary-600);
    margin-bottom: 20px;
  }

  &__flag {
    position: absolute;
    top: 24px;
    right: 24px;
    font-size: 32px;
  }

  &__title {
    font-family: @font-display;
    font-size: 24px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 12px;
  }

  &__text {
    font-family: @font-body;
    font-size: 15px;
    color: @neutral-600;
    line-height: 1.6;
    margin: 0 0 24px;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-700;

      svg {
        color: @success-500;
        flex-shrink: 0;
      }
    }
  }
}

// ============================================
// ADVANTAGES SECTION
// ============================================
.about-advantages {
  padding: 100px 24px;
  background: @neutral-50;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
  }

  &__header {
    text-align: center;
    margin-bottom: 60px;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--primary-100);
    border-radius: 100px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-700);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__title {
    font-family: @font-display;
    font-size: 36px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }
}

.advantage-card {
  padding: 32px;
  background: @white;
  border-radius: 20px;
  border: 1px solid @neutral-200;
  text-align: center;
  transition: all 0.3s @ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.06);
  }

  &__icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    margin: 0 auto 20px;

    &--primary {
      background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
      color: var(--primary-600);
    }

    &--success {
      background: linear-gradient(135deg, @success-100 0%, @success-50 100%);
      color: @success-600;
    }

    &--warning {
      background: linear-gradient(135deg, @warning-100 0%, @warning-50 100%);
      color: @warning-600;
    }

    &--info {
      background: linear-gradient(135deg, @info-100 0%, @info-50 100%);
      color: @info-600;
    }
  }

  &__title {
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 8px;
  }

  &__text {
    font-family: @font-body;
    font-size: 14px;
    color: @neutral-600;
    line-height: 1.5;
    margin: 0;
  }
}

// ============================================
// QUALITY SECTION
// ============================================
.about-quality {
  padding: 100px 24px;
  background: @white;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: var(--primary-100);
    border-radius: 100px;
    font-family: @font-body;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-700);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__title {
    font-family: @font-display;
    font-size: 36px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 16px;
  }

  &__desc {
    font-family: @font-body;
    font-size: 16px;
    color: @neutral-600;
    line-height: 1.6;
    margin: 0 0 40px;
  }

  &__points {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
}

.quality-point {
  display: flex;
  gap: 20px;
  align-items: flex-start;

  &__number {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-500);
    border-radius: 12px;
    font-family: @font-display;
    font-size: 18px;
    font-weight: 700;
    color: @white;
    flex-shrink: 0;
  }

  &__content {
    h4 {
      font-family: @font-display;
      font-size: 18px;
      font-weight: 600;
      color: @neutral-900;
      margin: 0 0 4px;
    }

    p {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-600;
      line-height: 1.5;
      margin: 0;
    }
  }
}

.quality-badge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  border-radius: 24px;
  text-align: center;

  &__icon {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.15);
    border-radius: 50%;
    color: @white;
    margin-bottom: 24px;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__label {
    font-family: @font-body;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.8);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
  }

  &__value {
    font-family: @font-display;
    font-size: 56px;
    font-weight: 800;
    color: @white;
    line-height: 1;
  }

  &__sublabel {
    font-family: @font-body;
    font-size: 16px;
    color: rgba(255, 255, 255, 0.9);
    margin-top: 8px;
  }
}

// ============================================
// DISCLAIMER SECTION
// ============================================
.about-disclaimer {
  padding: 60px 24px;
  background: @warning-50;
  border-top: 1px solid @warning-200;
  border-bottom: 1px solid @warning-200;

  &__container {
    max-width: 900px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    align-items: flex-start;

    @media (max-width: 600px) {
      flex-direction: column;
      text-align: center;
      align-items: center;
    }
  }

  &__icon {
    width: 64px;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @warning-100;
    border-radius: 16px;
    color: @warning-600;
    flex-shrink: 0;
  }

  &__title {
    font-family: @font-display;
    font-size: 20px;
    font-weight: 700;
    color: @warning-800;
    margin: 0 0 8px;
  }

  &__text {
    font-family: @font-body;
    font-size: 15px;
    color: @warning-700;
    line-height: 1.6;
    margin: 0;
  }
}

// ============================================
// CTA SECTION
// ============================================
.about-cta {
  padding: 100px 24px;
  background: linear-gradient(180deg, @neutral-900 0%, @neutral-800 100%);
  text-align: center;

  &__container {
    max-width: 600px;
    margin: 0 auto;
  }

  &__title {
    font-family: @font-display;
    font-size: 32px;
    font-weight: 700;
    color: @white;
    margin: 0 0 16px;
  }

  &__text {
    font-family: @font-body;
    font-size: 16px;
    color: @neutral-300;
    line-height: 1.6;
    margin: 0 0 32px;
  }

  &__buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__signature {
    font-family: @font-body;
    font-size: 14px;
    font-style: italic;
    color: @neutral-500;
    margin: 40px 0 0;
  }
}
</style>
