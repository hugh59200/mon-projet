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
        <div class="quality__coa-scroll">
          <div class="quality__coa-track">
            <div
              v-for="coa in coaList"
              :key="coa.id"
              class="coa-card"
            >
              <div class="coa-card__header">
                <span class="coa-card__badge">COA</span>
                <span class="coa-card__title">{{ coa.name }}</span>
              </div>
              <div class="coa-card__body">
                <div class="coa-card__row">
                  <span>{{ t('home.quality.coa.hplc') }}</span>
                  <span>{{ coa.ref }}</span>
                </div>
                <div class="coa-card__row">
                  <span>{{ t('home.quality.coa.batch') }}</span>
                  <span>{{ coa.batch }}</span>
                </div>
                <div class="coa-card__row coa-card__row--highlight">
                  <span>{{ t('home.quality.coa.purity') }}</span>
                  <span>{{ coa.purity }}</span>
                </div>
                <div class="coa-card__row">
                  <span>{{ t('home.quality.coa.lcms') }}</span>
                  <span>{{ coa.mass }}</span>
                </div>
              </div>
              <div class="coa-card__footer">
                <BasicIconNext name="CheckCircle2" :size="18" />
                <span>{{ t('home.quality.coa.download') }}</span>
              </div>
            </div>
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

  // Liste des COA à afficher
  const coaList = [
    {
      id: 'bpc157',
      name: 'BPC-157 5mg',
      ref: 'BPC-157-5mg',
      batch: 'BP2024-0847',
      purity: '99.4%',
      mass: '1419.53 Da',
    },
    {
      id: 'semaglutide',
      name: 'Semaglutide 10mg',
      ref: 'SEMA-10mg',
      batch: 'SM2024-1203',
      purity: '98.7%',
      mass: '4113.58 Da',
    },
    {
      id: 'tb500',
      name: 'TB-500 5mg',
      ref: 'TB500-5mg',
      batch: 'TB2024-0562',
      purity: '99.1%',
      mass: '4963.50 Da',
    },
    {
      id: 'ipamorelin',
      name: 'Ipamorelin 5mg',
      ref: 'IPA-5mg',
      batch: 'IP2024-0891',
      purity: '99.6%',
      mass: '711.85 Da',
    },
  ]

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

    &__bg {
      display: none; // Géré par ContentBlock parent
    }

    &__inner {
      position: relative;
      z-index: 1;
      &--two-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 50px;
        align-items: center;
      }
    }

    &--quality {
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
      color: var(--content-block-text);
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
      color: var(--content-block-text-secondary);
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
          color: var(--content-block-text);
          margin: 0 0 4px;
        }
        p {
          font-family: @font-body;
          font-size: 14px;
          color: var(--content-block-text-muted);
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    &__visual {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    &__coa-scroll {
      position: relative;
      width: 320px;
      height: 450px;
      border-radius: 20px;
      overflow: hidden;

      // Masques de fondu en haut et en bas
      &::before,
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 50px;
        z-index: 2;
        pointer-events: none;
      }

      &::before {
        top: 0;
        background: linear-gradient(
          to bottom,
          rgba(var(--secondary-900-rgb), 1) 0%,
          transparent 100%
        );
      }

      &::after {
        bottom: 0;
        background: linear-gradient(
          to top,
          rgba(var(--secondary-900-rgb), 1) 0%,
          transparent 100%
        );
      }
    }

    &__coa-track {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px 0;
      animation: scrollCoaVertical 25s ease-in-out infinite;

      &:hover {
        animation-play-state: paused;
      }
    }

    @keyframes scrollCoaVertical {
      0%, 10% {
        transform: translateY(0);
      }
      45%, 55% {
        transform: translateY(calc(-50% + 225px));
      }
      90%, 100% {
        transform: translateY(0);
      }
    }
  }

  .coa-card {
    flex-shrink: 0;
    width: 300px;
    margin: 0 auto;
    background: rgba(var(--secondary-800-rgb), 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(var(--neutral-300-rgb), 0.1);
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
    transition: transform 0.3s @ease, box-shadow 0.3s @ease;

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.35);
    }

    &__header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: rgba(var(--secondary-700-rgb), 0.4);
      border-bottom: 1px solid rgba(var(--neutral-300-rgb), 0.08);
    }

    &__badge {
      padding: 3px 8px;
      background: rgba(@success-500, 0.2);
      border-radius: 5px;
      font-family: @font-body;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: @success-500;
    }

    &__title {
      font-family: @font-body;
      font-size: 13px;
      font-weight: 600;
      color: var(--content-block-text);
    }

    &__body {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    &__row {
      display: flex;
      justify-content: space-between;
      font-family: @font-body;
      font-size: 12px;

      span:first-child {
        color: var(--content-block-text-muted);
      }

      span:last-child {
        color: var(--content-block-text);
        font-weight: 500;
      }

      &--highlight {
        padding: 10px;
        margin: 2px -8px;
        background: rgba(@success-500, 0.1);
        border-radius: 6px;

        span:last-child {
          color: @success-500;
          font-weight: 700;
          font-size: 14px;
        }
      }
    }

    &__footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      background: rgba(@success-500, 0.08);
      border-top: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      font-family: @font-body;
      font-size: 12px;
      font-weight: 500;
      color: @success-500;
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
    .quality__coa-scroll {
      width: 100%;
      max-width: 400px;
      height: 380px;
    }
  });

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .quality__coa-scroll {
      width: 100%;
      height: 320px;
    }
    .coa-card {
      width: 280px;
    }
  });
</style>
