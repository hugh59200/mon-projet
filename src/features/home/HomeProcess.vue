<template>
  <section
    class="process"
    ref="sectionRef"
  >
    <SectionHeader
      :badge="t('home.process.badge')"
      :title="t('home.process.title')"
      :description="t('home.process.description')"
      light
    />

    <div class="process__timeline">
      <div class="process__line"></div>
      <div
        v-for="(step, i) in steps"
        :key="step.title"
        class="process__step"
        :class="`process__step--${step.variant}`"
      >
        <div class="process__marker">
          <span>{{ i + 1 }}</span>
        </div>
        <div class="process__card">
          <div class="process__card-icon">
            <component :is="step.icon" />
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed, h, onMounted, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import SectionHeader from './shared/SectionHeader.vue'

  const { t } = useI18n()
  const sectionRef = ref<HTMLElement | null>(null)

  const icon = (d: string) => () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d })],
    )

  const SearchIcon = icon('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z')
  const DocumentIcon = icon(
    'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  )
  const TruckIcon = icon(
    'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  )

  const steps = computed(() => [
    {
      title: t('home.process.steps.step1.title'),
      description: t('home.process.steps.step1.description'),
      variant: 'success',
      icon: SearchIcon,
    },
    {
      title: t('home.process.steps.step2.title'),
      description: t('home.process.steps.step2.description'),
      variant: 'primary',
      icon: DocumentIcon,
    },
    {
      title: t('home.process.steps.step3.title'),
      description: t('home.process.steps.step3.description'),
      variant: 'warning',
      icon: TruckIcon,
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

  @light-text-primary: @neutral-950;
  @light-text-secondary: @neutral-600;
  @light-bg-card: @white;

  .process {
    padding: 80px 40px;
    max-width: 1200px;
    margin: 0 auto;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__timeline {
      position: relative;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    &__line {
      position: absolute;
      top: 40px;
      left: 16.66%;
      right: 16.66%;
      height: 3px;
      background: linear-gradient(90deg, @success-500, var(--primary-500), @warning-500);
      opacity: 0.5;
      border-radius: 2px;
    }

    &__step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      &--success {
        --step-color: @success-500;
      }
      &--primary {
        --step-color: var(--primary-600);
      }
      &--warning {
        --step-color: @warning-500;
      }
    }

    &__marker {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: @light-bg-card;
      border: 3px solid var(--step-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 32px;
      position: relative;
      z-index: 2;
      transition: all 0.4s @ease;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

      span {
        font-family: @font-display;
        font-size: 28px;
        font-weight: 700;
        color: var(--step-color);
      }
    }

    &__step:hover &__marker {
      transform: scale(1.05);
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    }

    &__card {
      display: flex;
      flex-direction: column;
      gap: 12px;

      &-icon {
        width: 48px;
        height: 48px;
        margin: 0 auto 8px;
        color: var(--step-color);
        svg {
          width: 100%;
          height: 100%;
        }
      }

      h3 {
        font-family: @font-display;
        font-size: 22px;
        font-weight: 600;
        color: @light-text-primary;
        margin: 0;
      }

      p {
        font-family: @font-body;
        font-size: 15px;
        line-height: 1.6;
        color: @light-text-secondary;
        margin: 0;
        max-width: 280px;
      }
    }
  }

  // Responsive - Tablet (≤ 1160px)
  .respond-tablet({
    .process__timeline {
      grid-template-columns: 1fr;
      gap: 60px;
    }
    .process__line {
      display: none;
    }
  });

  // Responsive - Mobile (≤ 720px)
  .respond-mobile({
    .process {
      padding: 60px 20px;
    }
    .process__card h3 {
      font-size: 20px;
    }
    .process__marker {
      width: 64px;
      height: 64px;
      span {
        font-size: 24px;
      }
    }
  });
</style>
