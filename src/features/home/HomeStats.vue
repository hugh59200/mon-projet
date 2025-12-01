<template>
  <section
    class="stats"
    ref="sectionRef"
  >
    <div class="stats__grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stats__item"
        :class="`stats__item--${stat.variant}`"
      >
        <div class="stats__icon">
          <component :is="stat.icon" />
        </div>
        <div class="stats__value">{{ stat.value }}</div>
        <div class="stats__label">{{ stat.label }}</div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { h, onMounted, ref } from 'vue'

  const sectionRef = ref<HTMLElement | null>(null)

  const icon = (d: string) => () =>
    h(
      'svg',
      { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5' },
      [h('path', { d })],
    )

  const BeakerIcon = icon(
    'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  )
  const ShieldIcon = icon(
    'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  )
  const TruckIcon = icon(
    'M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0',
  )
  const GlobeIcon = icon(
    'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  )

  const stats = [
    { value: '50+', label: 'Peptides disponibles', variant: 'success', icon: BeakerIcon },
    { value: '99%', label: 'Pureté garantie', variant: 'primary', icon: ShieldIcon },
    { value: '24h', label: 'Expédition rapide', variant: 'warning', icon: TruckIcon },
    { value: '100%', label: 'Stock européen', variant: 'info', icon: GlobeIcon },
  ]

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

  .stats {
    padding: 60px 40px;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s @ease;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }

    &__grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    &__item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px 24px;
      background: var(--secondary-900);
      border: 1px solid rgba(var(--neutral-300-rgb), 0.08);
      border-radius: 20px;
      text-align: center;
      transition: all 0.4s @ease;

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }

      &--success .stats__icon {
        background: rgba(@success-500, 0.15);
        color: @success-500;
      }
      &--primary .stats__icon {
        background: rgba(var(--primary-500-rgb), 0.15);
        color: var(--primary-400);
      }
      &--warning .stats__icon {
        background: rgba(@warning-500, 0.15);
        color: @warning-500;
      }
      &--info .stats__icon {
        background: rgba(@info-500, 0.15);
        color: @info-500;
      }
    }

    &__icon {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 28px;
        height: 28px;
      }
    }

    &__value {
      font-family: @font-display;
      font-size: 36px;
      font-weight: 700;
      color: @neutral-50;
      letter-spacing: -0.02em;
    }

    &__label {
      font-family: @font-body;
      font-size: 14px;
      color: @neutral-400;
    }
  }

  @media (max-width: 1100px) {
    .stats__grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .stats {
      padding: 60px 20px;
      &__grid {
        grid-template-columns: 1fr;
      }
    }
  }
</style>
