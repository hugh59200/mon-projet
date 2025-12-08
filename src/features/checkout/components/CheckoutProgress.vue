<template>
  <div class="checkout-progress">
    <div
      class="checkout-progress__step"
      :class="{
        'checkout-progress__step--active': currentStep >= 1,
        'checkout-progress__step--done': currentStep > 1,
      }"
    >
      <div class="checkout-progress__number">
        <BasicIconNext v-if="currentStep > 1" name="Check" :size="14" :stroke-width="3" />
        <span v-else>1</span>
      </div>
      <span class="checkout-progress__label">{{ t('checkout.steps.cart') }}</span>
    </div>

    <div
      class="checkout-progress__line"
      :class="{ 'checkout-progress__line--active': currentStep > 1 }"
    />

    <div
      class="checkout-progress__step"
      :class="{
        'checkout-progress__step--active': currentStep >= 2,
        'checkout-progress__step--done': currentStep > 2,
      }"
    >
      <div class="checkout-progress__number">
        <BasicIconNext v-if="currentStep > 2" name="Check" :size="14" :stroke-width="3" />
        <span v-else>2</span>
      </div>
      <span class="checkout-progress__label">{{ t('checkout.steps.shipping') }}</span>
    </div>

    <div
      class="checkout-progress__line"
      :class="{ 'checkout-progress__line--active': currentStep > 2 }"
    />

    <div
      class="checkout-progress__step"
      :class="{ 'checkout-progress__step--active': currentStep >= 3 }"
    >
      <div class="checkout-progress__number">3</div>
      <span class="checkout-progress__label">{{ t('checkout.steps.payment') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  currentStep: number
}>()

const { t } = useI18n()
</script>

<style scoped lang="less">
.checkout-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  background: linear-gradient(
    135deg,
    rgba(var(--primary-500-rgb), 0.08) 0%,
    rgba(var(--primary-500-rgb), 0.04) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(var(--primary-500-rgb), 0.12);
  margin-bottom: 32px;

  &__step {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 16px;
    border-radius: 100px;
    transition: all 0.3s ease;
    background: transparent;

    &--active {
      background: var(--bg-surface);
      box-shadow: var(--shadow-sm);

      .checkout-progress__number {
        background: var(--primary-600);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--primary-600-rgb), 0.4);

        span {
          color: inherit;
        }
      }

      .checkout-progress__label {
        color: var(--text-primary);
        font-weight: 600;
      }
    }

    &--done {
      .checkout-progress__number {
        background: @success-500;
        color: white;
        box-shadow: 0 4px 12px rgba(var(--success-500-rgb), 0.4);
      }
    }
  }

  &__number {
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--border-default);
    color: var(--text-muted);
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
    transition: all 0.3s ease;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-muted);
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  &__line {
    width: 40px;
    height: 2px;
    background: var(--border-default);
    border-radius: 1px;
    transition: all 0.3s ease;

    &--active {
      background: linear-gradient(90deg, @success-500 0%, var(--primary-500) 100%);
    }
  }
}

// Tablet
.respond-tablet({
  .checkout-progress {
    gap: 4px;
    padding: 16px;

    &__step {
      padding: 6px 12px;
    }

    &__line {
      width: 24px;
    }

    &__label {
      font-size: 13px;
    }
  }
});

// Mobile
.respond-mobile({
  .checkout-progress {
    gap: 2px;
    padding: 12px 8px;
    border-radius: 16px;

    &__step {
      padding: 6px 8px;
      gap: 6px;
    }

    &__number {
      width: 24px;
      height: 24px;
      font-size: 11px;
    }

    &__label {
      font-size: 11px;
    }

    &__line {
      width: 16px;
    }
  }
});
</style>
