<template>
  <section class="trust-bar">
    <div class="trust-bar__container">
      <div
        v-for="item in trustItems"
        :key="item.label"
        class="trust-bar__item"
      >
        <BasicIconNext
          :name="item.icon"
          :size="20"
          class="trust-bar__icon"
        />
        <div class="trust-bar__content">
          <span class="trust-bar__value">{{ item.value }}</span>
          <span class="trust-bar__label">{{ item.label }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { IconNameNext } from '@designSystem/components/basic/icon/BasicIconNext.types'

  const { t } = useI18n()

  interface TrustItem {
    icon: IconNameNext
    value: string
    label: string
  }

  const trustItems = computed<TrustItem[]>(() => [
    {
      icon: 'FlaskConical',
      value: t('home.stats.purity.value'),
      label: t('home.stats.purity.label'),
    },
    {
      icon: 'Truck',
      value: t('home.stats.shipping.value'),
      label: t('home.stats.shipping.label'),
    },
    {
      icon: 'Globe',
      value: t('home.stats.stock.value'),
      label: t('home.stats.stock.label'),
    },
    {
      icon: 'ShieldCheck',
      value: 'COA',
      label: t('product.trustBadges.quality'),
    },
  ])
</script>

<style scoped lang="less">
  @font-body: 'Inter', 'SF Pro Text', -apple-system, sans-serif;

  .trust-bar {
    padding: 0 40px;
    margin: -30px auto 0;
    position: relative;
    z-index: 10;
    max-width: 1000px;

    &__container {
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 0;
      background: linear-gradient(
        135deg,
        rgba(20, 20, 35, 0.95) 0%,
        rgba(15, 15, 28, 0.98) 100%
      );
      backdrop-filter: blur(20px);
      border: 1px solid rgba(var(--primary-500-rgb), 0.15);
      border-radius: 16px;
      overflow: hidden;
      box-shadow:
        0 4px 24px rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.03) inset;
    }

    &__item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 22px 24px;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      transition: background 0.2s ease;

      &:last-child {
        border-right: none;
      }

      &:hover {
        background: rgba(var(--primary-500-rgb), 0.05);
      }
    }

    &__icon {
      color: var(--primary-400);
      flex-shrink: 0;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    &__value {
      font-family: @font-body;
      font-size: 15px;
      font-weight: 600;
      color: @white;
      letter-spacing: -0.01em;
    }

    &__label {
      font-family: @font-body;
      font-size: 12px;
      color: @neutral-400;
    }
  }

  // Tablet
  .respond-tablet({
    .trust-bar {
      padding: 0 24px;
      margin-top: -20px;

      &__container {
        flex-wrap: wrap;
      }

      &__item {
        flex: 1 1 50%;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);

        &:nth-child(2) {
          border-right: none;
        }

        &:nth-child(3),
        &:nth-child(4) {
          border-bottom: none;
        }
      }
    }
  });

  // Mobile
  .respond-mobile({
    .trust-bar {
      padding: 0 16px;
      margin-top: -16px;

      &__container {
        border-radius: 12px;
      }

      &__item {
        padding: 14px 12px;
        gap: 10px;
      }

      &__value {
        font-size: 13px;
      }

      &__label {
        font-size: 11px;
      }
    }
  });
</style>
