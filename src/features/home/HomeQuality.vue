<template>
  <section
    class="layout-section layout-section--quality"
    ref="sectionRef"
  >
    <div class="layout-section__bg">
      <div class="layout-section__pattern"></div>
      <div class="layout-section__glow layout-section__glow--quality-1"></div>
      <div class="layout-section__glow layout-section__glow--quality-2"></div>
    </div>

    <div class="layout-section__inner layout-section__inner--two-cols">
      <div class="quality__content">
        <span class="quality__badge">{{ t('home.quality.badge') }}</span>
        <h2 class="quality__title">
          {{ t('home.quality.title.line1') }}
          <br />
          <span>{{ t('home.quality.title.accent') }}</span>
        </h2>
        <p class="quality__desc">
          {{ t('home.quality.description') }}
        </p>

        <div class="quality__features">
          <div
            v-for="f in features"
            :key="f.title"
            class="quality__feature"
            :class="`quality__feature--${f.variant}`"
          >
            <div class="quality__feature-icon">
              <component :is="f.icon" />
            </div>
            <div class="quality__feature-text">
              <h4>{{ f.title }}</h4>
              <p>{{ f.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="quality__visual">
        <div class="coa-card">
          <div class="coa-card__header">
            <span class="coa-card__badge">COA</span>
            <span class="coa-card__title">{{ t('home.quality.coa.title') }}</span>
          </div>
          <div class="coa-card__body">
            <div class="coa-card__row">
              <span>{{ t('home.quality.coa.hplc') }}</span>
              <span>BPC-157-5mg</span>
            </div>
            <div class="coa-card__row">
              <span>{{ t('home.quality.coa.batch') }}</span>
              <span>BP2024-0847</span>
            </div>
            <div class="coa-card__row coa-card__row--highlight">
              <span>{{ t('home.quality.coa.purity') }}</span>
              <span>99.4%</span>
            </div>
            <div class="coa-card__row">
              <span>{{ t('home.quality.coa.lcms') }}</span>
              <span>1419.53 Da</span>
            </div>
            <div class="coa-card__row">
              <span>{{ t('home.quality.coa.subtitle') }}</span>
              <span>✓</span>
            </div>
          </div>
          <div class="coa-card__footer">
            <BasicIconNext name="CheckCircle2" :size="20" />
            <span>{{ t('home.quality.coa.download') }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, h, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t } = useI18n()
  const sectionRef = ref<HTMLElement | null>(null)

  const icon = (d: string) => () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d })],
    )

  const CheckIcon = icon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')
  const BeakerIcon = icon(
    'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  )
  const GlobeIcon = icon(
    'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  )
  const LeafIcon = icon(
    'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  )

  const features = computed(() => [
    {
      title: t('home.quality.features.f1.title'),
      description: t('home.quality.features.f1.description'),
      variant: 'success',
      icon: CheckIcon,
    },
    {
      title: t('home.quality.features.f2.title'),
      description: t('home.quality.features.f2.description'),
      variant: 'primary',
      icon: BeakerIcon,
    },
    {
      title: t('home.quality.features.f3.title'),
      description: t('home.quality.features.f3.description'),
      variant: 'warning',
      icon: GlobeIcon,
    },
    {
      title: t('home.quality.features.f4.title'),
      description: t('home.quality.features.f4.description'),
      variant: 'info',
      icon: LeafIcon,
    },
  ])

  onMounted(() => {
    if ('IntersectionObserver' in window && sectionRef.value) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('is-visible')
          })
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
      )
      obs.observe(sectionRef.value)
    }
  })
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

    &__bg {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
    }

    &__pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(var(--primary-400-rgb), 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
    }

    &__glow {
      position: absolute;
      border-radius: 50%;
      &--quality-1 {
        width: 200px;
        height: 200px;
        background: rgba(@success-500, 0.15);
        top: -50px;
        right: -50px;
        filter: blur(60px);
      }
      &--quality-2 {
        width: 150px;
        height: 150px;
        background: rgba(var(--primary-500-rgb), 0.15);
        bottom: -30px;
        left: 0;
        filter: blur(60px);
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

    &--quality {
      margin-top: 40px;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s @ease;
      &.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  .quality {
    &__content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    &__badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(@success-500, 0.15);
      border-radius: 100px;
      font-family: @font-body;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: @success-500;
      width: fit-content;
    }

    &__title {
      font-family: @font-display;
      font-size: clamp(36px, 4vw, 52px);
      font-weight: 600;
      color: @neutral-50;
      margin: 0;
      line-height: 1.1;
      letter-spacing: -0.02em;
      span {
        background: linear-gradient(135deg, @success-500 0%, var(--primary-400) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    &__desc {
      font-family: @font-body;
      font-size: 17px;
      line-height: 1.7;
      color: @neutral-300;
      margin: 0;
    }
    &__features {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 16px;
    }

    &__feature {
      display: flex;
      gap: 16px;
      align-items: flex-start;
      &--success .quality__feature-icon {
        background: rgba(@success-500, 0.15);
        color: @success-500;
      }
      &--primary .quality__feature-icon {
        background: rgba(var(--primary-500-rgb), 0.15);
        color: var(--primary-400);
      }
      &--warning .quality__feature-icon {
        background: rgba(@warning-500, 0.15);
        color: @warning-500;
      }
      &--info .quality__feature-icon {
        background: rgba(@info-500, 0.15);
        color: @info-500;
      }

      &-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        svg {
          width: 22px;
          height: 22px;
        }
      }

      &-text {
        h4 {
          font-family: @font-display;
          font-size: 16px;
          font-weight: 600;
          color: @neutral-50;
          margin: 0 0 4px;
        }
        p {
          font-family: @font-body;
          font-size: 14px;
          color: @neutral-400;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    &__visual {
      display: flex;
      justify-content: center;
    }
  }

  .coa-card {
    width: 340px;
    background: rgba(var(--secondary-800-rgb), 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(var(--neutral-300-rgb), 0.1);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);

    &__header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: rgba(var(--secondary-700-rgb), 0.4);
      border-bottom: 1px solid rgba(var(--neutral-300-rgb), 0.08);
    }

    &__badge {
      padding: 4px 10px;
      background: rgba(@success-500, 0.2);
      border-radius: 6px;
      font-family: @font-body;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: @success-500;
    }

    &__title {
      font-family: @font-body;
      font-size: 14px;
      font-weight: 500;
      color: @neutral-100;
    }
    &__body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      font-family: @font-body;
      font-size: 13px;
      span:first-child {
        color: @neutral-400;
      }
      span:last-child {
        color: @neutral-100;
        font-weight: 500;
      }

      &--highlight {
        padding: 12px;
        margin: 4px -12px;
        background: rgba(@success-500, 0.1);
        border-radius: 8px;
        span:last-child {
          color: @success-500;
          font-weight: 700;
          font-size: 15px;
        }
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 20px;
      background: rgba(@success-500, 0.08);
      border-top: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      font-family: @font-body;
      font-size: 13px;
      font-weight: 500;
      color: @success-500;
      svg {
        width: 18px;
        height: 18px;
      }
    }
  }

  // Responsive - Tablet (≤ 1160px)
  .respond-tablet({
    .layout-section__inner--two-cols {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .quality__content {
      text-align: center;
      align-items: center;
    }
    .quality__visual {
      order: -1;
    }
  });

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .layout-section {
      padding: 60px 20px;
    }
    .quality__visual {
      display: none;
    }
    .coa-card {
      width: 100%;
    }
  });
</style>
