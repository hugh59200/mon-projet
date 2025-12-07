<template>
  <ContentBlock as="section" variant="card" size="lg" class="checkout-payment">
    <div class="checkout-payment__header">
      <div class="checkout-payment__icon">
        <BasicIconNext name="CreditCard" :size="20" />
      </div>
      <div>
        <h2 class="checkout-payment__title">{{ t('checkout.steps.payment') }}</h2>
        <p class="checkout-payment__subtitle">{{ t('checkout.payment.method') }}</p>
      </div>
    </div>

    <div class="checkout-payment__methods">
      <!-- Méthodes disponibles -->
      <div class="checkout-payment__available">
        <!-- Crypto-monnaie -->
        <button
          class="payment-card"
          :class="{ 'payment-card--active': modelValue === 'crypto' }"
          type="button"
          @click="$emit('update:modelValue', 'crypto')"
        >
          <div class="payment-card__radio">
            <div class="payment-card__radio-inner" />
          </div>
          <div class="payment-card__icon payment-card__icon--crypto">
            <BasicIconNext name="Bitcoin" :size="24" />
          </div>
          <div class="payment-card__content">
            <span class="payment-card__title">{{ t('checkout.payment.crypto') }}</span>
            <span class="payment-card__desc">{{ t('checkout.payment.cryptoDesc') }}</span>
          </div>
          <div class="payment-card__crypto-icons">
            <span class="payment-card__crypto-badge">BTC</span>
            <span class="payment-card__crypto-badge">USDT</span>
            <span class="payment-card__crypto-badge">ETH</span>
          </div>
        </button>

        <!-- Explication crypto -->
        <Transition name="fade">
          <div v-if="modelValue === 'crypto'" class="checkout-payment__crypto-help">
            <div class="crypto-help__header">
              <BasicIconNext name="Info" :size="18" />
              <span>{{ t('checkout.payment.cryptoHelp.title') }}</span>
            </div>
            <ol class="crypto-help__steps">
              <li>{{ t('checkout.payment.cryptoHelp.step1') }}</li>
              <li>{{ t('checkout.payment.cryptoHelp.step2') }}</li>
              <li>{{ t('checkout.payment.cryptoHelp.step3') }}</li>
              <li>{{ t('checkout.payment.cryptoHelp.step4') }}</li>
            </ol>
            <router-link to="/guide-crypto" class="crypto-help__link">
              <BasicIconNext name="BookOpen" :size="14" />
              {{ t('checkout.payment.cryptoHelp.guide') }}
            </router-link>
          </div>
        </Transition>
      </div>

      <!-- Section Bientôt disponible -->
      <div class="checkout-payment__coming-soon">
        <button
          class="checkout-payment__coming-header"
          type="button"
          @click="showComingSoon = !showComingSoon"
        >
          <div class="checkout-payment__coming-left">
            <BasicIconNext name="Clock" :size="16" />
            <span>{{ t('checkout.payment.otherMethods') }}</span>
            <span class="checkout-payment__coming-badge">{{ t('common.comingSoon') }}</span>
          </div>
          <BasicIconNext
            name="ChevronDown"
            :size="20"
            class="checkout-payment__coming-chevron"
            :class="{ 'checkout-payment__coming-chevron--open': showComingSoon }"
          />
        </button>

        <!-- Contenu collapsible - Virement bancaire -->
        <Transition name="collapse">
          <div v-if="showComingSoon" class="checkout-payment__coming-content">
            <div class="payment-card payment-card--disabled">
              <div class="payment-card__icon payment-card__icon--bank">
                <BasicIconNext name="Landmark" :size="24" />
              </div>
              <div class="payment-card__content">
                <span class="payment-card__title">{{ t('checkout.payment.bankTransfer') }}</span>
                <span class="payment-card__desc">{{ t('checkout.payment.bankTransferDesc') }}</span>
              </div>
              <div class="payment-card__badge-coming">
                {{ t('common.comingSoon') }}
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </ContentBlock>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

type PaymentMethod = 'bank_transfer' | 'crypto'

defineProps<{
  modelValue: PaymentMethod
}>()

defineEmits<{
  (e: 'update:modelValue', value: PaymentMethod): void
}>()

const { t } = useI18n()
const showComingSoon = ref(false)
</script>

<style scoped lang="less">
@import '@designSystem/fondation/selection/selectable-mixins.less';

.checkout-payment {
  // Styles de base gérés par ContentBlock

  &__header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary-100) 0%, var(--primary-50) 100%);
    border-radius: 14px;
    color: var(--primary-600);
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: @neutral-900;
    margin: 0 0 4px;
  }

  &__subtitle {
    font-size: 14px;
    color: @neutral-500;
    margin: 0;
  }

  &__methods {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__coming-soon {
    border: 1px solid @neutral-200;
    border-radius: 16px;
    overflow: hidden;
  }

  &__coming-header {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: @neutral-50;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: @neutral-100;
    }
  }

  &__coming-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: @neutral-600;
  }

  &__coming-badge {
    font-size: 11px;
    font-weight: 600;
    color: @warning-700;
    background: @warning-100;
    padding: 3px 8px;
    border-radius: 6px;
  }

  &__coming-chevron {
    color: @neutral-400;
    transition: transform 0.3s ease;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__coming-content {
    padding: 16px;
    border-top: 1px solid @neutral-200;
  }

  &__crypto-help {
    margin-top: 16px;
    padding: 20px;
    background: linear-gradient(135deg, @orange-50 0%, @neutral-50 100%);
    border: 1px solid @orange-200;
    border-radius: 14px;
  }
}

.crypto-help {
  &__header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: @orange-700;
    margin-bottom: 14px;
  }

  &__steps {
    margin: 0 0 14px 0;
    padding-left: 20px;
    font-size: 13px;
    color: @neutral-700;
    line-height: 1.8;

    li {
      margin-bottom: 4px;

      &::marker {
        color: @orange-500;
        font-weight: 600;
      }
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--primary-600);
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--primary-700);
      text-decoration: underline;
    }
  }
}

.payment-card {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 20px;
  min-height: 44px;

  // Utilise le mixin dark pour cohérence avec QuantitySelector
  .selectable-card();
  border-width: 2px;
  border-radius: 16px;

  &--active {
    .selectable-card--active();

    .payment-card__radio-inner {
      transform: scale(1);
      opacity: 1;
    }
  }

  &--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: var(--secondary-900);
  }

  &__radio {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s ease;

    .payment-card--active & {
      border-color: var(--primary-500);
    }
  }

  &__radio-inner {
    width: 10px;
    height: 10px;
    background: var(--primary-500);
    border-radius: 50%;
    transform: scale(0);
    opacity: 0;
    transition: all 0.2s ease;
  }

  &__icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    flex-shrink: 0;

    &--crypto {
      background: linear-gradient(135deg, @orange-100 0%, @orange-50 100%);
      color: @orange-600;
    }

    &--bank {
      background: linear-gradient(135deg, @blue-100 0%, @blue-50 100%);
      color: @blue-600;
    }
  }

  &__content {
    flex: 1;
    text-align: left;
    min-width: 0;
  }

  &__title {
    display: block;
    font-size: 15px;
    font-weight: 600;
    color: @white;
    margin-bottom: 2px;
  }

  &__desc {
    display: block;
    font-size: 13px;
    color: @neutral-400;
  }

  &__crypto-icons {
    display: flex;
    gap: 6px;
    flex-shrink: 0;
  }

  &__crypto-badge {
    font-size: 11px;
    font-weight: 700;
    color: @orange-700;
    background: @orange-100;
    padding: 4px 8px;
    border-radius: 6px;
  }

  &__badge-coming {
    font-size: 11px;
    font-weight: 600;
    color: @neutral-500;
    background: @neutral-200;
    padding: 4px 10px;
    border-radius: 8px;
    flex-shrink: 0;
  }
}

// Collapse animation
.collapse-enter-active,
.collapse-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

// Fade animation
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.collapse-enter-from,
.collapse-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

// Tablet
.respond-tablet({
  .payment-card {
    padding: 16px;
    gap: 12px;

    &__icon {
      width: 44px;
      height: 44px;
    }
  }
});

// Mobile
.respond-mobile({
  .checkout-payment {
    &__header {
      gap: 12px;
      margin-bottom: 16px;
    }

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    &__title {
      font-size: 16px;
    }
  }

  .payment-card {
    padding: 14px;
    gap: 10px;
    border-radius: 12px;
    min-height: 60px;

    &__icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }

    &__title {
      font-size: 14px;
    }

    &__desc {
      font-size: 12px;
    }

    &__crypto-icons {
      flex-direction: column;
      gap: 4px;
    }

    &__crypto-badge {
      font-size: 10px;
      padding: 2px 6px;
    }
  }
});
</style>
